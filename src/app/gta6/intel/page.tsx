import type { Metadata } from "next";
import { IntelClient } from "@/components/IntelClient";

export const metadata: Metadata = {
  title: "GTA 6 Live Intel & Auto-Synced Feed",
  description:
    "Automatically synced GTA 6 English & Chinese news, GTA Wiki confirmed items, and Wikipedia updates powered by Cloudflare D1.",
};

export default function IntelPage() {
  return <IntelClient />;
}
