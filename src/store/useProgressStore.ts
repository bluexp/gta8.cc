"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProgressSnapshot {
  version: number;
  exportedAt: string;
  completedMarkers: string[];
  completedChecklist: string[];
}

interface ProgressState {
  completedMarkers: string[];
  completedChecklist: string[];
  cloudSyncEnabled: boolean;
  cloudUserId: string | null;
  lastSyncedAt: string | null;
  syncStatus: "idle" | "syncing" | "synced" | "error";

  toggleMarker: (markerId: string) => void;
  setMarkerCompleted: (markerId: string, completed: boolean) => void;
  toggleChecklistItem: (itemId: string, linkedMarkerId?: string) => void;
  isChecklistCompleted: (itemId: string, linkedMarkerId?: string) => boolean;

  exportSnapshot: () => string;
  importSnapshot: (jsonText: string) => { ok: boolean; count?: number; error?: string };
  resetAll: () => void;

  setCloudSync: (enabled: boolean, userId?: string) => Promise<void>;
  syncWithCloud: () => Promise<void>;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      completedMarkers: [],
      completedChecklist: [],
      cloudSyncEnabled: false,
      cloudUserId: null,
      lastSyncedAt: null,
      syncStatus: "idle",

      toggleMarker: (markerId) => {
        set((state) => {
          const exists = state.completedMarkers.includes(markerId);
          const next = exists
            ? state.completedMarkers.filter((id) => id !== markerId)
            : [...state.completedMarkers, markerId];
          return { completedMarkers: next };
        });
        if (get().cloudSyncEnabled && get().cloudUserId) {
          void get().syncWithCloud();
        }
      },

      setMarkerCompleted: (markerId, completed) => {
        set((state) => {
          const exists = state.completedMarkers.includes(markerId);
          if (completed && !exists) {
            return { completedMarkers: [...state.completedMarkers, markerId] };
          }
          if (!completed && exists) {
            return {
              completedMarkers: state.completedMarkers.filter((id) => id !== markerId),
            };
          }
          return state;
        });
      },

      toggleChecklistItem: (itemId, linkedMarkerId) => {
        if (linkedMarkerId) {
          get().toggleMarker(linkedMarkerId);
          return;
        }
        set((state) => {
          const exists = state.completedChecklist.includes(itemId);
          const next = exists
            ? state.completedChecklist.filter((id) => id !== itemId)
            : [...state.completedChecklist, itemId];
          return { completedChecklist: next };
        });
      },

      isChecklistCompleted: (itemId, linkedMarkerId) => {
        const state = get();
        if (linkedMarkerId) {
          return state.completedMarkers.includes(linkedMarkerId);
        }
        return state.completedChecklist.includes(itemId);
      },

      exportSnapshot: () => {
        const { completedMarkers, completedChecklist } = get();
        const payload: ProgressSnapshot = {
          version: 1,
          exportedAt: new Date().toISOString(),
          completedMarkers,
          completedChecklist,
        };
        return JSON.stringify(payload, null, 2);
      },

      importSnapshot: (jsonText) => {
        try {
          const parsed = JSON.parse(jsonText) as Partial<ProgressSnapshot>;
          if (!Array.isArray(parsed.completedMarkers)) {
            return { ok: false, error: "无效的存档格式：缺少 completedMarkers 数组" };
          }
          const mergedMarkers = Array.from(
            new Set([
              ...get().completedMarkers,
              ...parsed.completedMarkers.filter((x): x is string => typeof x === "string"),
            ])
          );
          const mergedChecklist = Array.from(
            new Set([
              ...get().completedChecklist,
              ...(Array.isArray(parsed.completedChecklist)
                ? parsed.completedChecklist.filter((x): x is string => typeof x === "string")
                : []),
            ])
          );
          set({
            completedMarkers: mergedMarkers,
            completedChecklist: mergedChecklist,
          });
          return { ok: true, count: mergedMarkers.length + mergedChecklist.length };
        } catch {
          return { ok: false, error: "JSON 解析失败，请检查导入文件内容" };
        }
      },

      resetAll: () => {
        set({ completedMarkers: [], completedChecklist: [] });
      },

      setCloudSync: async (enabled, userId) => {
        const nextUserId = userId ?? get().cloudUserId;
        set({
          cloudSyncEnabled: enabled,
          cloudUserId: nextUserId,
          syncStatus: enabled ? "syncing" : "idle",
        });
        if (enabled && nextUserId) {
          await get().syncWithCloud();
        }
      },

      syncWithCloud: async () => {
        const { cloudUserId, completedMarkers } = get();
        if (!cloudUserId) return;
        set({ syncStatus: "syncing" });
        try {
          const res = await fetch("/api/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: cloudUserId, completedMarkers }),
          });
          if (!res.ok) throw new Error("Sync failed");
          const data = (await res.json()) as {
            completedMarkers?: string[];
            updatedAt?: string;
          };
          set({
            completedMarkers: Array.isArray(data.completedMarkers)
              ? data.completedMarkers
              : completedMarkers,
            lastSyncedAt: data.updatedAt ?? new Date().toISOString(),
            syncStatus: "synced",
          });
        } catch {
          set({ syncStatus: "error" });
        }
      },
    }),
    {
      name: "gta8-cc-progress-v1",
      partialize: (state) => ({
        completedMarkers: state.completedMarkers,
        completedChecklist: state.completedChecklist,
        cloudSyncEnabled: state.cloudSyncEnabled,
        cloudUserId: state.cloudUserId,
        lastSyncedAt: state.lastSyncedAt,
      }),
    }
  )
);
