# Security Policy

## Supported Versions

Only the latest deployment on the `main` branch (`https://gta8.cc`) receives security updates.

## Reporting a Vulnerability

If you discover a security vulnerability in **GTA8.cc** (for example, an authentication bypass on `/admin`, injection issue on D1 API routes, or XSS vector):

- **Please do NOT open a public GitHub Issue.**
- Instead, report it privately via [GitHub Security Advisories](https://github.com/bluexp/gta8.cc/security/advisories/new) or email `bluexp@126.com` with:
  - A clear description of the vulnerability and potential impact
  - Steps to reproduce or proof-of-concept
  - Suggested remediation (if known)

We will acknowledge receipt within 72 hours and coordinate a fix before public disclosure.

## Deployment Security Best Practices (For Self-Hosters)

- Always configure a strong `ADMIN_TOKEN` via `npx wrangler secret put ADMIN_TOKEN`. Without it, `/api/admin/*` fails closed (`401 Unauthorized`).
- Enable Cloudflare Turnstile by setting `TURNSTILE_SECRET_KEY` via `npx wrangler secret put TURNSTILE_SECRET_KEY`.
- Never commit `.env.local`, `.dev.vars`, or Cloudflare API tokens to Git.
