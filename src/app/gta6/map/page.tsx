import type { Metadata } from "next";
import { Suspense } from "react";
import { MapWorkspace } from "@/components/map/MapWorkspace";

export const metadata: Metadata = {
  title: "Leonida Interactive Map",
  description:
    "GTA 6 interactive Leonida map with satellite & vector layers, collectibles/vehicles/heists filters, zero-login progress tracking, and shareable coordinates.",
};

export default function Gta6MapPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-[#070A12] text-sm text-zinc-400">
          Initializing Leonida Interactive Map...
        </div>
      }
    >
      <MapWorkspace />
    </Suspense>
  );
}
