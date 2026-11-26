import type { Metadata } from "next";
import { CollectiblesClient } from "@/components/CollectiblesClient";

export const metadata: Metadata = {
  title: "GTA 6 Collectibles Guide (WAiNK, Stunt Jumps & Packages)",
  description:
    "Complete Leonida collectibles guide with coordinates, progress tracking, and one-click map navigation.",
};

export default function CollectiblesPage() {
  return <CollectiblesClient />;
}
