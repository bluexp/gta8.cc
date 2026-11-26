import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VEHICLES, getVehicleBySlug } from "@/data/vehicles";
import { getMarkerById } from "@/data/markers";
import { VehicleDetailClient } from "@/components/wiki/VehicleDetailClient";
import { formatMoney } from "@/lib/utils";
import type { MapMarker } from "@/types/gta";

export function generateStaticParams() {
  return VEHICLES.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = getVehicleBySlug(slug);
  if (!vehicle) return { title: "Vehicle Not Found" };
  return {
    title: `${vehicle.titleEn} (${vehicle.titleZh}) Stats & Spawn Locations`,
    description: `${vehicle.titleEn} top speed ${vehicle.stats.topSpeedKmh} km/h, Anti-Theft Tier ${vehicle.stats.antiTheft}, price ${formatMoney(vehicle.stats.price)}.`,
  };
}

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vehicle = getVehicleBySlug(slug);
  if (!vehicle) notFound();

  const spawnMarkers = vehicle.spawnMarkerIds
    .map((id) => getMarkerById(id))
    .filter((m): m is MapMarker => Boolean(m));

  const similar = VEHICLES.filter(
    (v) =>
      v.slug !== vehicle.slug &&
      (v.category === vehicle.category ||
        Math.abs(v.stats.topSpeed - vehicle.stats.topSpeed) < 15)
  ).slice(0, 3);

  return (
    <VehicleDetailClient
      vehicle={vehicle}
      spawnMarkers={spawnMarkers}
      similar={similar}
    />
  );
}
