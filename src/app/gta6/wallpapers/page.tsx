import type { Metadata } from "next";
import { WallpapersClient } from "@/components/WallpapersClient";

export const metadata: Metadata = {
  title: "GTA 6 Leonida Mobile Wallpapers (9:16 HD Lock Screen)",
  description:
    "Free high-resolution vertical 9:16 GTA 6 Vice City & Leonida phone wallpapers with interactive iPhone/Android lock-screen clock preview and watermark-free download.",
};

export default function WallpapersPage() {
  return <WallpapersClient />;
}
