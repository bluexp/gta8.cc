import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://gta8.cc"),
  title: {
    default: "GTA8.cc · GTA 6 Interactive Leonida Map & Complete Wiki",
    template: "%s | GTA8.cc · GTA 6 Map & Wiki",
  },
  description:
    "All-in-one GTA 6 interactive Leonida map, 100% completion tracker, vehicles & weapons database, PS5/Xbox cheat codes, and heist payout calculator — bilingual English & Chinese.",
  keywords: [
    "GTA 6",
    "GTA 6 Map",
    "Leonida Interactive Map",
    "GTA 6 Collectibles",
    "GTA 6 Vehicles",
    "GTA 6 Cheat Codes",
    "GTA8.cc",
    "GTA6 地图",
    "雷奥奈达交互地图",
  ],
  openGraph: {
    title: "GTA8.cc · GTA 6 Interactive Leonida Map & Complete Wiki",
    description:
      "Dark neon interactive Leonida map + 100% completion checklist + bilingual vehicles, weapons, cheats & live GTA 6 intel.",
    url: "https://gta8.cc",
    siteName: "GTA8.cc",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="flex min-h-screen flex-col bg-[#0D0F14] text-zinc-100 antialiased selection:bg-[#FF2E93]/35 selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
