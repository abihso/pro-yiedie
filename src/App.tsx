import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const App = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth / 2;

      scrollRef.current.scrollTo({
        left:
          direction === "left"
            ? scrollLeft - scrollAmount
            : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative flex items-center w-full max-w-md my-4">
      <Button
        variant="outline"
        size="icon"
        onClick={() => scroll("left")}
        className="absolute left-0 z-10 h-8 w-8 rounded-full bg-white shadow-md -translate-x-3"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div
        ref={scrollRef}
        className="flex items-center gap-3 overflow-x-auto scrollbar-none px-2 py-1 w-full scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <Button variant="default" className="shrink-0 rounded-2xl">
          Option 1
        </Button>
        <Button variant="outline" className="shrink-0 rounded-2xl">
          Option 2
        </Button>
        <Button variant="outline" className="shrink-0 rounded-2xl">
          Option 3
        </Button>
        <Button variant="outline" className="shrink-0 rounded-2xl">
          Option 4
        </Button>
        <Button variant="outline" className="shrink-0 rounded-2xl">
          Option 4
        </Button>
        <Button variant="outline" className="shrink-0 rounded-2xl">
          Option 4
        </Button>
        <Button variant="outline" className="shrink-0 rounded-2xl">
          Option 4
        </Button>
        <Button variant="outline" className="shrink-0 rounded-2xl">
          Option 4
        </Button>
        <Button variant="outline" className="shrink-0 rounded-2xl">
          Option 4
        </Button>
        <Button variant="outline" className="shrink-0 rounded-2xl">
          Option 4
        </Button>
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={() => scroll("right")}
        className="absolute right-0 z-10 h-8 w-8 rounded-full bg-white shadow-md translate-x-3"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default App;
