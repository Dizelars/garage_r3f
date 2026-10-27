/// <reference types="vite/client" />

declare global {
  interface ModelViewerElement extends HTMLElement {
    canActivateAR: boolean;
    activateAR: () => void;
  }
}

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<ModelViewerElement>,
        ModelViewerElement
      > & {
        src?: string;
        alt?: string;
        ar?: boolean;
        "ar-modes"?: string;
        "ar-placement"?: string;
        "camera-controls"?: boolean;
      };
      "dotlottie-player": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        src?: string;
        background?: string;
        speed?: string | number;
        loop?: boolean;
        autoplay?: boolean;
        preload?: boolean;
      };
    }
  }
}

export {};
