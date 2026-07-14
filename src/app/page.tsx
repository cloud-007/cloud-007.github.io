import { Header } from "@/components/header";
import { LivingTrail } from "@/components/living-trail";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />
      <main>
        {/* The Living Trail is the home of this portfolio; everything else
            lives under /about */}
        <LivingTrail />
      </main>
      <Footer />
    </div>
  );
}
