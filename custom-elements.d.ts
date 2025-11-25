// Type declarations for custom web components
import "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "app-router": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

export {};
