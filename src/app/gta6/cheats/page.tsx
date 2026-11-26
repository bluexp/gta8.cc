import type { Metadata } from "next";
import { CheatsClient } from "@/components/CheatsClient";

export const metadata: Metadata = {
  title: "GTA 6 PS5 & Xbox Cheat Codes (Visual Controller Icons)",
  description:
    "Visual PS5 DualSense & Xbox controller cheat codes and in-game phone numbers for GTA 6 with instant filter and copy.",
};

export default function CheatsPage() {
  return <CheatsClient />;
}
