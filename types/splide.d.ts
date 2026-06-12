declare module "@splidejs/react-splide" {
  import type { ComponentType, ReactNode } from "react";

  export const Splide: ComponentType<{
    "aria-label"?: string;
    children?: ReactNode;
    options?: Record<string, unknown>;
  }>;

  export const SplideSlide: ComponentType<{
    children?: ReactNode;
  }>;
}

declare module "@splidejs/react-splide/css";
