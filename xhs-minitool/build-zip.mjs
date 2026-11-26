import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const ROOT = path.resolve(process.cwd(), "xhs-minitool");
const SRC_DIR = path.join(ROOT, "src");
const RELEASE_DIR = path.join(ROOT, "release");
const ZIP_PATH = path.join(RELEASE_DIR, "gta8-xhs-minitool-v1.0.0.zip");

const ALLOWED_EXTS = new Set([
  ".html",
  ".css",
  ".js",
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".svg",
  ".woff",
  ".woff2",
  ".json",
]);

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function validate() {
  const files = walk(SRC_DIR);
  const errors = [];
  let htmlCount = 0;

  for (const file of files) {
    const rel = path.relative(SRC_DIR, file);
    const ext = path.extname(file).toLowerCase();
    if (!ALLOWED_EXTS.has(ext)) {
      errors.push(`Disallowed extension: ${rel}`);
      continue;
    }
    if (ext === ".html") {
      htmlCount++;
      const html = fs.readFileSync(file, "utf8");
      if (/<script(?![^>]*\bsrc=)[^>]*>/i.test(html)) {
        errors.push(`Inline <script> forbidden in ${rel}`);
      }
      if (/\son[a-z]+\s*=/i.test(html)) {
        errors.push(`Inline event handler forbidden in ${rel}`);
      }
      if (/https?:\/\//i.test(html)) {
        errors.push(`External URL found in ${rel}`);
      }
      if (/<iframe\b/i.test(html)) {
        errors.push(`<iframe> forbidden in ${rel}`);
      }
    }
    if (ext === ".js") {
      const js = fs.readFileSync(file, "utf8");
      const forbidden = [
        [/\beval\s*\(/, "eval()"],
        [/\bnew\s+Function\s*\(/, "new Function()"],
        [/\bfetch\s*\(/, "fetch()"],
        [/\bXMLHttpRequest\b/, "XMLHttpRequest"],
        [/\blocalStorage\b/, "localStorage"],
        [/\bnavigator\.clipboard\b/, "navigator.clipboard"],
        [/\bwindow\.open\b/, "window.open"],
        [/https?:\/\//i, "external URL"],
      ];
      for (const [re, name] of forbidden) {
        if (re.test(js)) errors.push(`Forbidden ${name} in ${rel}`);
      }
      // Verify ES2017 / Chrome 61 syntax compatibility via esbuild
      execSync(
        `npx esbuild "${file}" --target=chrome61 --outfile=/tmp/xhs_check_${path.basename(file)}`,
        { stdio: "pipe" }
      );
    }
  }

  if (htmlCount !== 1) {
    errors.push(`Must have exactly 1 HTML file, found ${htmlCount}`);
  }

  if (errors.length > 0) {
    console.error("[xhs-validator] FAILED:\n - " + errors.join("\n - "));
    process.exit(1);
  }
  console.log(`[xhs-validator] PASSED all strict CSP, offline & Chrome 61 checks (${files.length} files).`);
}

function buildZip() {
  fs.mkdirSync(RELEASE_DIR, { recursive: true });
  if (fs.existsSync(ZIP_PATH)) fs.unlinkSync(ZIP_PATH);
  execSync(`cd "${SRC_DIR}" && zip -r -X "${ZIP_PATH}" . -x ".*" "__MACOSX/*"`, {
    stdio: "inherit",
  });
  const sizeBytes = fs.statSync(ZIP_PATH).size;
  const sizeMb = (sizeBytes / (1024 * 1024)).toFixed(2);
  if (sizeBytes > 10 * 1024 * 1024) {
    console.error(`[xhs-packager] FAILED: zip size ${sizeMb} MB exceeds 10 MB limit.`);
    process.exit(1);
  }
  console.log(`[xhs-packager] READY -> ${ZIP_PATH} (${sizeMb} MB / 10 MB limit)`);
}

validate();
buildZip();
