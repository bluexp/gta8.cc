import type { Metadata } from "next";
import { VehiclesClient } from "@/components/wiki/VehiclesClient";

export const metadata: Metadata = {
  title: "GTA 6 Vehicles Database (Top Speed, Anti-Theft & Spawns)",
  description:
    "Bilingual GTA 6 vehicles encyclopedia with top speed, handling, Tier 1-5 anti-theft ratings, and interactive spawn locations.",
};

export default function VehiclesPage() {
  return <VehiclesClient />;
}
