import type { Metadata } from "next";
import { ChecklistClient } from "@/components/ChecklistClient";

export const metadata: Metadata = {
  title: "GTA 6 100% Completion & Trophy Checklist",
  description:
    "Track GTA 6 100% completion and Platinum trophies—bidirectionally synced with Leonida interactive map markers.",
};

export default function ChecklistPage() {
  return <ChecklistClient />;
}
