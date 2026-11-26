"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import type { MapMarker } from "@/types/gta";
import type { Locale } from "@/store/useLocaleStore";
import { CATEGORY_META, LEONIDA_REGIONS } from "@/lib/categories";
import { buildLeonidaSvgDataUrl, type BasemapStyle } from "./leonidaBasemap";

interface LeonidaMapEngineProps {
  markers: MapMarker[];
  completedIds: string[];
  selectedMarkerId: string | null;
  basemap: BasemapStyle;
  locale: Locale;
  flyTarget: { x: number; y: number; zoom?: number; seq: number } | null;
  onSelectMarker: (marker: MapMarker) => void;
  onCursorMove?: (coords: { x: number; y: number }) => void;
  onCopyShareLink?: (x: number, y: number) => void;
  onSubmitAtCoords?: (x: number, y: number) => void;
}

const WORLD_BOUNDS: L.LatLngBoundsExpression = [
  [-2000, -2000],
  [2000, 2000],
];

const REGION_LABEL_COLORS: Record<string, string> = {
  "vice-beach": "#FF73B8",
  "vice-downtown": "#38BDF8",
  "leonida-keys": "#00E5FF",
  grassrivers: "#4ADE80",
  "port-gellhorn": "#FCD34D",
  ambrosia: "#D8B4FE",
  "mount-kalaga": "#E2E8F0",
};

interface ClusterNode {
  key: string;
  x: number;
  y: number;
  items: MapMarker[];
}

function clusterMarkers(markers: MapMarker[], zoom: number): ClusterNode[] {
  if (zoom > -1.25) {
    return markers.map((m) => ({ key: m.id, x: m.x, y: m.y, items: [m] }));
  }
  const cellSize = zoom <= -2 ? 480 : 280;
  const buckets = new Map<string, MapMarker[]>();
  for (const m of markers) {
    const cx = Math.floor(m.x / cellSize);
    const cy = Math.floor(m.y / cellSize);
    const k = `${cx}:${cy}`;
    const arr = buckets.get(k);
    if (arr) arr.push(m);
    else buckets.set(k, [m]);
  }
  const nodes: ClusterNode[] = [];
  for (const [k, items] of buckets.entries()) {
    const avgX = items.reduce((s, i) => s + i.x, 0) / items.length;
    const avgY = items.reduce((s, i) => s + i.y, 0) / items.length;
    nodes.push({ key: k, x: avgX, y: avgY, items });
  }
  return nodes;
}

export function LeonidaMapEngine({
  markers,
  completedIds,
  selectedMarkerId,
  basemap,
  locale,
  flyTarget,
  onSelectMarker,
  onCursorMove,
  onCopyShareLink,
  onSubmitAtCoords,
}: LeonidaMapEngineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const baseLayerRef = useRef<L.Layer | null>(null);
  const labelLayerRef = useRef<L.LayerGroup | null>(null);
  const markerLayerRef = useRef<L.LayerGroup | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(-1.5);

  const callbacksRef = useRef({
    locale,
    onSelectMarker,
    onCursorMove,
    onCopyShareLink,
    onSubmitAtCoords,
  });
  callbacksRef.current = {
    locale,
    onSelectMarker,
    onCursorMove,
    onCopyShareLink,
    onSubmitAtCoords,
  };

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      crs: L.CRS.Simple,
      minZoom: -2.5,
      maxZoom: 2,
      zoom: -1.5,
      zoomSnap: 0.25,
      zoomDelta: 0.5,
      wheelPxPerZoomLevel: 90,
      center: [40, 120],
      maxBounds: [
        [-2500, -2500],
        [2500, 2500],
      ],
      maxBoundsViscosity: 0.85,
      zoomControl: false,
      attributionControl: false,
    });

    L.control.zoom({ position: "bottomright" }).addTo(map);
    labelLayerRef.current = L.layerGroup().addTo(map);
    markerLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    map.on("zoomend", () => {
      setZoomLevel(map.getZoom());
    });

    map.on("mousemove", (e: L.LeafletMouseEvent) => {
      callbacksRef.current.onCursorMove?.({
        x: Math.round(e.latlng.lng),
        y: Math.round(e.latlng.lat),
      });
    });

    map.on("contextmenu", (e: L.LeafletMouseEvent) => {
      const rx = Math.round(e.latlng.lng);
      const ry = Math.round(e.latlng.lat);
      const isEn = callbacksRef.current.locale === "en";
      const popupEl = document.createElement("div");
      popupEl.className = "space-y-2 text-xs min-w-[215px]";
      popupEl.innerHTML = `
        <div class="font-mono text-[#00E5FF] font-bold">${
          isEn ? "Coordinates" : "坐标定位"
        } · X ${rx}, Y ${ry}</div>
        <div class="text-zinc-400 text-[11px]">gta8.cc/gta6/map?x=${rx}&y=${ry}</div>
        <div class="flex gap-1.5 pt-1">
          <button data-action="copy" class="flex-1 rounded-md bg-[#FF2E93] px-2.5 py-1.5 font-semibold text-white hover:bg-[#ff47a0] cursor-pointer">${
            isEn ? "Copy Share Link" : "复制分享链接"
          }</button>
          <button data-action="submit" class="rounded-md border border-white/15 bg-white/5 px-2.5 py-1.5 font-medium text-zinc-200 hover:bg-white/10 cursor-pointer">${
            isEn ? "Submit Pin" : "投稿点位"
          }</button>
        </div>
      `;
      popupEl.querySelector('[data-action="copy"]')?.addEventListener("click", () => {
        callbacksRef.current.onCopyShareLink?.(rx, ry);
        map.closePopup();
      });
      popupEl.querySelector('[data-action="submit"]')?.addEventListener("click", () => {
        callbacksRef.current.onSubmitAtCoords?.(rx, ry);
        map.closePopup();
      });

      L.popup({ closeButton: true })
        .setLatLng(e.latlng)
        .setContent(popupEl)
        .openOn(map);
    });

    return () => {
      map.remove();
      mapRef.current = null;
      baseLayerRef.current = null;
      labelLayerRef.current = null;
      markerLayerRef.current = null;
    };
  }, []);

  // Switch basemap layer: R2 tiles if configured, photorealistic satellite JPG, or organic vector SVG
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (baseLayerRef.current) {
      map.removeLayer(baseLayerRef.current);
    }

    const tilesBase = process.env.NEXT_PUBLIC_TILES_BASE_URL?.trim();
    if (tilesBase) {
      const tileLayer = L.tileLayer(`${tilesBase}/${basemap}/{z}/{x}/{y}.webp`, {
        minZoom: -2.5,
        maxZoom: 5,
        noWrap: true,
        bounds: WORLD_BOUNDS,
      });
      tileLayer.addTo(map);
      baseLayerRef.current = tileLayer;
    } else if (basemap === "satellite") {
      const overlay = L.imageOverlay("/maps/leonida-satellite.jpg", WORLD_BOUNDS, {
        className: "leonida-sat-overlay",
        opacity: 0.96,
      });
      overlay.addTo(map);
      baseLayerRef.current = overlay;
    } else {
      const overlay = L.imageOverlay(buildLeonidaSvgDataUrl("vector"), WORLD_BOUNDS);
      overlay.addTo(map);
      baseLayerRef.current = overlay;
    }
  }, [basemap]);

  // Crisp bilingual district watermarks that stay sharp at any zoom level
  useEffect(() => {
    const layer = labelLayerRef.current;
    if (!layer) return;
    layer.clearLayers();
    const isEn = locale === "en";

    for (const reg of LEONIDA_REGIONS) {
      const color = REGION_LABEL_COLORS[reg.id] ?? "#E2E8F0";
      const icon = L.divIcon({
        className: "leonida-region-label",
        iconSize: [160, 32],
        iconAnchor: [80, 16],
        html: `
          <div style="pointer-events:none;line-height:1.15;">
            <div style="font-size:11px;font-weight:900;letter-spacing:0.12em;color:${color};text-transform:uppercase;">
              ${reg.en}
            </div>
            <div style="font-size:10px;font-weight:700;color:rgba(241,245,249,0.82);margin-top:1px;">
              ${isEn ? "" : reg.zh}
            </div>
          </div>
        `,
      });
      L.marker([reg.center.y, reg.center.x], {
        icon,
        interactive: false,
        keyboard: false,
        zIndexOffset: -500,
      }).addTo(layer);
    }
  }, [locale]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !flyTarget) return;
    map.flyTo([flyTarget.y, flyTarget.x], flyTarget.zoom ?? 0, {
      duration: 0.75,
    });
  }, [flyTarget]);

  useEffect(() => {
    const map = mapRef.current;
    const layer = markerLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();
    const completedSet = new Set(completedIds);
    const nodes = clusterMarkers(markers, zoomLevel);
    const isEn = locale === "en";

    for (const node of nodes) {
      if (node.items.length > 1) {
        const doneCount = node.items.filter((m) => completedSet.has(m.id)).length;
        const allDone = doneCount === node.items.length;
        const icon = L.divIcon({
          className: "",
          iconSize: [38, 38],
          iconAnchor: [19, 19],
          html: `
            <div class="gta-marker-pin ${allDone ? "is-collected" : ""}" style="
              width:38px;height:38px;border-radius:9999px;
              background:radial-gradient(circle, rgba(255,46,147,0.92), rgba(22,25,34,0.95));
              border:2px solid #00E5FF;
              box-shadow:0 0 16px rgba(0,229,255,0.45);
              display:flex;align-items:center;justify-content:center;
              color:#fff;font-weight:800;font-size:12px;font-family:monospace;cursor:pointer;">
              ${node.items.length}
            </div>
          `,
        });

        const clusterPin = L.marker([node.y, node.x], { icon });
        clusterPin.on("click", () => {
          map.flyTo([node.y, node.x], Math.min(zoomLevel + 1.5, 1), { duration: 0.55 });
        });
        clusterPin.addTo(layer);
      } else {
        const m = node.items[0];
        const meta = CATEGORY_META[m.category];
        const isDone = completedSet.has(m.id);
        const isSelected = selectedMarkerId === m.id;

        const icon = L.divIcon({
          className: "",
          iconSize: [30, 30],
          iconAnchor: [15, 15],
          html: `
            <div class="gta-marker-pin ${isDone ? "is-collected" : ""} ${isSelected ? "is-selected" : ""}" style="
              width:30px;height:30px;border-radius:9px;
              background:${isSelected ? meta.color : "rgba(18,22,34,0.92)"};
              border:2px solid ${isSelected ? "#FFFFFF" : meta.color};
              box-shadow:0 0 ${isSelected ? "20px" : "10px"} ${meta.color}88;
              display:flex;align-items:center;justify-content:center;
              color:${isSelected ? "#0D0F14" : meta.color};
              font-weight:900;font-size:10px;letter-spacing:-0.02em;cursor:pointer;">
              ${isDone ? "✓" : meta.shortCode}
            </div>
          `,
        });

        const pin = L.marker([m.y, m.x], { icon });
        const title = isEn ? m.titleEn : m.titleZh;
        const reg = isEn ? m.regionEn : m.region;
        pin.bindTooltip(
          `<div style="font-size:12px;font-weight:700;color:#fff">${title}</div><div style="font-size:10px;color:#94a3b8">${reg} · X ${m.x}, Y ${m.y}</div>`,
          { direction: "top", offset: [0, -14] }
        );
        pin.on("click", () => {
          callbacksRef.current.onSelectMarker(m);
        });
        pin.addTo(layer);
      }
    }
  }, [markers, completedIds, selectedMarkerId, zoomLevel, locale]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full select-none"
      aria-label={locale === "en" ? "Leonida Interactive Map" : "雷奥奈达交互式大地图"}
    />
  );
}
