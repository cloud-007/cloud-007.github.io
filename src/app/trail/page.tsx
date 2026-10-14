import type { Metadata } from "next";
import { Header } from "@/components/header";
import { LivingTrail } from "@/components/living-trail";
import { Footer } from "@/components/footer";

export const metadata: Metadata = { title: "Growth trail | Mazharul Islam", description: "A personal record of engineering, community, contests and lessons." };
export default function TrailPage() {
  return <><Header /><main id="main-content"><LivingTrail /></main><Footer /></>;
}
