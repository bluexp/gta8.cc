import type { Metadata } from "next";
import { GuidesClient } from "@/components/GuidesClient";

export const metadata: Metadata = {
  title: "GTA 6 Guides & Heist Payout Calculator",
  description:
    "Interactive Leonida heist payout calculator plus GTA 6 story branches, Tier 1-5 anti-theft guide, and Vice City easter eggs.",
};

export default function GuidesPage() {
  return <GuidesClient />;
}
