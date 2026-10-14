import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Projects } from "@/components/projects";
import { CurrentWork } from "@/components/current-work";
import { Footer } from "@/components/footer";

export default function Home() {
  return <><Header /><main id="main-content"><Hero home /><Projects selected /><CurrentWork /></main><Footer /></>;
}
