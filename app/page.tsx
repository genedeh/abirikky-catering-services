import { HeroSection } from "@/views/home/HeroSection";
import { AboutSection } from "@/views/home/AboutSection";

export default function Home() {
  return (
    <main className="min-h-screen" aria-label="Abirikky home page">
      <HeroSection />
      <AboutSection />
    </main>
  );
}
