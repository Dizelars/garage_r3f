import { useEffect, useRef } from "react";

type AFrameComponentHost = {
  el: {
    addEventListener: (type: string, handler: (event: { detail: { currspots: string; newspots: string } }) => void) => void;
    parentElement: { getAttribute: (name: string) => string | null } | null;
  };
  data: {
    linkto: string;
    spotgroup: string;
    phiStart: string;
  };
};

type AFrameApi = {
  registerComponent: (name: string, definition: object) => void;
};

let componentsRegistered = false;

function emit(element: HTMLElement | null, name: string, detail?: object) {
  if (!element) {
    return;
  }

  const target = element as HTMLElement & {
    emit?: (eventName: string, eventDetail?: object) => void;
  };

  if (target.emit) {
    target.emit(name, detail);
    return;
  }

  target.dispatchEvent(new CustomEvent(name, { detail }));
}

function registerPanoramaComponents() {
  const aframe = (window as Window & { AFRAME?: AFrameApi }).AFRAME;
  if (!aframe || componentsRegistered) {
    return;
  }

  componentsRegistered = true;

  aframe.registerComponent("hotspots", {
    init(this: AFrameComponentHost) {
      this.el.addEventListener("reloadspots", (event) => {
        const currentGroup = document.getElementById(event.detail.currspots);
        currentGroup?.setAttribute("scale", "0 0 0");
        const nextGroup = document.getElementById(event.detail.newspots);
        nextGroup?.setAttribute("scale", "1 1 1");
      });
    },
  });

  aframe.registerComponent("spot", {
    schema: {
      linkto: { type: "string", default: "" },
      spotgroup: { type: "string", default: "" },
      phiStart: { type: "string", default: "" },
    },
    init(this: AFrameComponentHost) {
      this.el.addEventListener("click", () => {
        const camera = document.getElementById("cam");
        emit(camera, "zoomin");
        const fadePlane = document.getElementById("camfadeplane");
        fadePlane?.setAttribute("width", "2");
        fadePlane?.setAttribute("height", "2");
        emit(fadePlane, "camFadeIn");

        window.setTimeout(() => {
          const sky = document.getElementById("skybox");
          sky?.setAttribute("src", this.data.linkto);
          sky?.setAttribute("phi-start", this.data.phiStart);
          const spots = document.getElementById("spots");
          const currentSpots = this.el.parentElement?.getAttribute("id") ?? "";
          emit(spots, "reloadspots", {
            newspots: this.data.spotgroup,
            currspots: currentSpots,
          });
          emit(camera, "zoomout");
          emit(fadePlane, "camFadeOut");
          window.setTimeout(() => {
            fadePlane?.setAttribute("width", "0");
            fadePlane?.setAttribute("height", "0");
          }, 1000);
        }, 2000);
      });
    },
  });
}

type PanoramaProps = {
  markup: string;
};

export function Panorama({ markup }: PanoramaProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) {
      return;
    }

    let disposed = false;

    void import("aframe").then(() => {
      if (disposed || !hostRef.current) {
        return;
      }
      registerPanoramaComponents();
      hostRef.current.innerHTML = markup;
    });

    return () => {
      disposed = true;
      host.innerHTML = "";
    };
  }, [markup]);

  return <div ref={hostRef} />;
}
