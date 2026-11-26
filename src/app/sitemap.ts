import type { MetadataRoute } from "next";
import { VEHICLES } from "@/data/vehicles";
import { WEAPONS } from "@/data/weapons";

const SITE_URL = "https://gta8.cc";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/gta6/map",
    "/gta6/intel",
    "/gta6/wallpapers",
    "/gta6/checklist",
    "/gta6/vehicles",
    "/gta6/weapons",
    "/gta6/collectibles",
    "/gta6/cheats",
    "/gta6/guides",
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === "" || route === "/gta6/map" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route === "/gta6/map" ? 0.95 : 0.85,
  }));

  const vehicleRoutes: MetadataRoute.Sitemap = VEHICLES.map((v) => ({
    url: `${SITE_URL}/gta6/vehicles/${v.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const weaponRoutes: MetadataRoute.Sitemap = WEAPONS.map((w) => ({
    url: `${SITE_URL}/gta6/weapons/${w.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.78,
  }));

  return [...staticRoutes, ...vehicleRoutes, ...weaponRoutes];
}
