import {
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
} from "react";

export function Motion({
  children,
  className,
  stagger = 0,
  threshold = 0.3,
}: {
  children: React.ReactElement<
    {
      className?: string;
      style?: React.CSSProperties;
    } & React.RefAttributes<HTMLElement>
  >;
  className?: string;
  stagger?: number;
  threshold?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current || inView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      {
        threshold,
      },
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  if (!isValidElement(children)) return null;

  return cloneElement(children, {
    ref,
    className:
      children.props.className + (inView && className ? ` ${className}` : ""),
    style: {
      transitionDelay: `${stagger}ms`,
    },
  });
}
