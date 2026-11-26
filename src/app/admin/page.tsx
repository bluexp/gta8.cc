import type { Metadata } from "next";
import { AdminClient } from "@/components/AdminClient";

export const metadata: Metadata = {
  title: "数据同步与社区审核管理台",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminClient />;
}
