import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WEAPONS, getWeaponBySlug } from "@/data/weapons";
import { getMarkerById } from "@/data/markers";
import { WeaponDetailClient } from "@/components/wiki/WeaponDetailClient";
import type { MapMarker } from "@/types/gta";

export function generateStaticParams() {
  return WEAPONS.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const weapon = getWeaponBySlug(slug);
  if (!weapon) return { title: "Weapon Not Found" };
  return {
    title: `${weapon.titleEn} (${weapon.titleZh}) Stats & Gun Van Spawns`,
    description: `${weapon.titleEn} Damage ${weapon.stats.damage}, Fire Rate ${weapon.stats.fireRate}, Magazine ${weapon.stats.clipSize}.`,
  };
}

export default async function WeaponDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const weapon = getWeaponBySlug(slug);
  if (!weapon) notFound();

  const spawnMarkers = weapon.spawnMarkerIds
    .map((id) => getMarkerById(id))
    .filter((m): m is MapMarker => Boolean(m));

  return <WeaponDetailClient weapon={weapon} spawnMarkers={spawnMarkers} />;
}
