import { HeroSection } from "@/views/home/HeroSection";
import { AboutSection } from "@/views/home/AboutSection";
import { MenuSection } from "@/views/home/MenuSection";

export default function Home() {
  return (
    <main className="min-h-screen" aria-label="Abirikky home page">
      <HeroSection />
      <AboutSection />
      <MenuSection />
    </main>
  );
}
