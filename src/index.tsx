import { useEffect, useRef, useState } from "react";

export function Animate({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      {
        threshold: 0.3,
      },
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return inView ? children : <div ref={ref} />;
}
