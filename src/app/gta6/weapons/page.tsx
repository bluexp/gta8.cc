import type { Metadata } from "next";
import { WeaponsClient } from "@/components/wiki/WeaponsClient";

export const metadata: Metadata = {
  title: "GTA 6 Weapons & Gun Van Armory Database",
  description:
    "Complete GTA 6 weapons stats, attachments, and Black Market Gun Van coordinates across Leonida.",
};

export default function WeaponsPage() {
  return <WeaponsClient />;
}
