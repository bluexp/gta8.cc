#!/usr/bin/env python3
"""
GTA8.cc 雷奥奈达高清地图瓦片切图流水线 (pyvips -> Google Tile Pyramid .webp)

依赖安装（macOS）：
  brew install vips
  pip install pyvips

用法示例：
  python3 scripts/slice-tiles.py \\
    --input ./leonida-satellite-16384.png \\
    --output ./tiles-output/satellite \\
    --quality 82 \\
    --tile-size 256

上传至 Cloudflare R2（绑定 tiles.gta8.cc）：
  rclone copy ./tiles-output r2:gta8-tiles \\
    --transfers 32 \\
    --header-upload "Cache-Control: public, max-age=31536000, immutable"
"""

import argparse
from pathlib import Path
import sys


def main() -> int:
    parser = argparse.ArgumentParser(description="Slice high-res Leonida map into WebP tiles.")
    parser.add_argument("--input", required=True, help="高分辨率原图路径 (如 8192x8192 / 16384x16384)")
    parser.add_argument("--output", required=True, help="输出切片目录 (如 ./tiles-output/satellite)")
    parser.add_argument("--tile-size", type=int, default=256, help="单瓦片尺寸，默认 256")
    parser.add_argument("--quality", type=int, default=82, help="WebP 质量 (80-85 推荐)")
    args = parser.parse_args()

    try:
        import pyvips  # type: ignore
    except ImportError:
        print("错误：未安装 pyvips。请先运行: brew install vips && pip install pyvips", file=sys.stderr)
        return 1

    src = Path(args.input)
    if not src.exists():
        print(f"错误：找不到输入图片 {src}", file=sys.stderr)
        return 1

    out_dir = Path(args.output)
    out_dir.parent.mkdir(parents=True, exist_ok=True)

    print(f"[slice-tiles] 正在加载底图: {src} ...")
    image = pyvips.Image.new_from_file(str(src), access="sequential")
    print(f"[slice-tiles] 原图尺寸: {image.width}x{image.height}, 开始生成 Google 金字塔 WebP 切片...")

    image.dzsave(
        str(out_dir),
        layout="google",
        suffix=f".webp[Q={args.quality}]",
        tile_size=args.tile_size,
        overlap=0,
        background=[7, 10, 18],
        centre=True,
    )

    print(f"[slice-tiles] 切片完成 -> {out_dir}/{{z}}/{{x}}/{{y}}.webp")
    print("[slice-tiles] 提示：可使用 rclone 同步至 Cloudflare R2 (tiles.gta8.cc) 并设置 Cache-Control: public, max-age=31536000, immutable")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
