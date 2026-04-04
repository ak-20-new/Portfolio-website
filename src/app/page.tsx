import ScrollyCanvas from "@/components/ScrollyCanvas";
import Projects from "@/components/Projects";

export default function Home() {
  return (
    <main className="w-full relative bg-[#121212]">
      {/* 500vh relative container for the scroll-linked sequence */}
      <ScrollyCanvas />

      {/* Projects section rendered below */}
      <Projects />
    </main>
  );
}
