import * as React from "react";
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
  style,
  repeat = false,
  threshold = 0.3,
}: {
  children: React.ReactElement<
    {
      className?: string;
      style: React.CSSProperties;
    } & React.RefAttributes<HTMLElement>
  >;
  style?: React.CSSProperties;
  className?: string;
  threshold?: number;
  repeat?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && !repeat) {
          observer.unobserve(ref.current!);
          observer.disconnect();
        }
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
      (children.props.className || "") +
      (inView && className ? ` ${className}` : ""),
    style,
  });
}

export function Staggered({
  children,
  stagger = 200,
}: {
  children: React.ReactNode;
  stagger?: number;
}) {
  return (
    <>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;

        const delay = index * stagger;

        return cloneElement(
          child as React.ReactElement<
            any,
            string | React.JSXElementConstructor<any>
          >,
          {
            style: {
              ...((child.props as any).style ?? {}),
              transitionDelay: `${delay}ms`,
              animationDelay: `${delay}ms !important`,
            },
          },
        );
      })}
    </>
  );
}
