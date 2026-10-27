import { useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import type { ModelPageData } from "entities/model/types";
import { ArButton } from "features/ar/ArButton";
import { FleetGallery } from "features/gallery/FleetGallery";
import { ModelHeader } from "features/header/ModelHeader";
import { SceneProgress } from "features/loader/SceneProgress";
import { Panorama } from "features/panorama/Panorama";
import { InteriorButton, TechSpec } from "features/specs/TechSpec";
import { AnimationButton } from "features/scene/AnimationButton";
import { GarageScene } from "shared/scene/GarageScene";

const interiorClassById: Record<string, string> = {
  pickup: "garage_pickup",
  bus: "garage_bus",
  kater: "garage_kater",
  moskvich: "garage_moskvich",
  kamaz: "garage_kamaz",
};

type ModelPageProps = {
  page: ModelPageData;
};

function parkShift(): string {
  const width = window.innerWidth;
  const landscape = window.matchMedia("(orientation: landscape)").matches;
  if (width <= 576 || (width <= 900 && landscape)) {
    return "translateY(15px)";
  }
  return "translateY(0)";
}

export function ModelPage({ page }: ModelPageProps) {
  useGLTF.preload(page.scene.modelUrl, page.scene.draco);

  const [collapsed, setCollapsed] = useState(true);
  const [parkOpen, setParkOpen] = useState(true);
  const [parkTransform, setParkTransform] = useState<string | undefined>(undefined);
  const [arrowRotated, setArrowRotated] = useState(true);
  const [sceneScaled, setSceneScaled] = useState(false);
  const [overlayActive, setOverlayActive] = useState(false);
  const [chromeHidden, setChromeHidden] = useState(false);
  const [sliderHidden, setSliderHidden] = useState(false);
  const [interiorOpen, setInteriorOpen] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [interiorLabel, setInteriorLabel] = useState(page.interior?.enterLabel ?? "");
  const [animationPlaying, setAnimationPlaying] = useState(false);
  const [interiorClassOn, setInteriorClassOn] = useState(false);
  const [activeSlide, setActiveSlide] = useState(() => {
    const index = page.gallery.findIndex((slide) => slide.active);
    return index < 0 ? 0 : index;
  });

  const togglePark = () => {
    if (parkOpen) {
      setParkTransform(parkShift());
      setArrowRotated(false);
    } else {
      setParkTransform("translateY(74%)");
      setArrowRotated(true);
    }
    setParkOpen((open) => !open);
  };

  const collapseSpecs = () => {
    setCollapsed(true);
  };

  const toggleSpecs = () => {
    setCollapsed((value) => !value);
    if (!parkOpen) {
      togglePark();
    }
  };

  useEffect(() => {
    const onMouseDown = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const insideSpecs = Boolean(target.closest(".tech_spec"));
      const insidePark = Boolean(target.closest(".auto_park_wrapper"));
      const insideSceneUi = Boolean(target.closest(".scene-animation, .interest-point"));
      const width = window.innerWidth;

      if ((!insideSpecs && !insideSceneUi) || (width <= 1200 && insideSpecs)) {
        collapseSpecs();
      }

      if (!insidePark && !insideSceneUi && !parkOpen) {
        togglePark();
      }
    };

    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [parkOpen]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const active = document.activeElement;
      if (!(active instanceof HTMLCanvasElement)) {
        return;
      }

      if (!collapsed) {
        collapseSpecs();
      } else if (!parkOpen) {
        togglePark();
      }
      window.focus();
    }, 100);

    return () => window.clearInterval(timer);
  }, [collapsed, parkOpen]);

  const handleParkControl = () => {
    if (!collapsed) {
      collapseSpecs();
    } else if (window.matchMedia("(orientation: landscape)").matches) {
      const titles = document.querySelector<HTMLElement>(".tech_spec__titles");
      const button = document.querySelector<HTMLElement>(".tech_spec__btn");
      const interior = document.querySelector<HTMLElement>(".tech_spec__interior");
      if (titles) {
        titles.style.height = "auto";
      }
      if (button) {
        button.style.display = "block";
      }
      if (interior) {
        interior.style.zIndex = "auto";
      }
    }

    togglePark();
  };

  const handleInterior = () => {
    if (!page.interior || transitioning) {
      return;
    }

    const opening = !interiorOpen;
    setTransitioning(true);
    setSceneScaled(true);
    setOverlayActive(true);
    setInteriorLabel(opening ? page.interior.exitLabel : page.interior.enterLabel);
    setInteriorClassOn((value) => !value);

    window.setTimeout(() => {
      setChromeHidden((value) => !value);
      setSceneScaled(false);
      setOverlayActive(false);
      setSliderHidden((value) => !value);
      setInteriorOpen(opening);
      setTransitioning(false);
      const scene = document.querySelector("a-scene") as (HTMLElement & {
        play: () => void;
        pause: () => void;
      }) | null;
      if (!scene) {
        return;
      }
      scene.style.opacity = opening ? "1" : "0";
      scene.style.height = opening ? "auto" : "0";
      scene.style.pointerEvents = opening ? "auto" : "none";
      if (opening) {
        scene.play();
      } else {
        scene.pause();
      }
      document.querySelectorAll<HTMLElement>(".point").forEach((point) => {
        point.style.zIndex = opening ? "0" : "1";
      });
    }, 1500);
  };

  return (
    <>
      <SceneProgress />
      <ModelHeader backHref={page.backHref} />
      <TechSpec
        title={page.title}
        missionHtml={page.missionHtml}
        outfit={page.outfit}
        collapsed={collapsed}
        hidden={chromeHidden}
        onToggle={toggleSpecs}
      />
      {page.interior ? (
        <InteriorButton
          interior={page.interior}
          label={interiorLabel}
          classOn={interiorClassOn}
          className={interiorClassById[page.interior.id]}
          onClick={handleInterior}
        />
      ) : null}
      <FleetGallery
        slides={page.gallery}
        hidden={chromeHidden}
        sliderHidden={sliderHidden}
        transform={parkTransform}
        arrowRotated={arrowRotated}
        onToggle={handleParkControl}
        onSlideClick={setActiveSlide}
        activeIndex={activeSlide}
      />
      {page.scene.animated ? (
        <AnimationButton
          playing={animationPlaying}
          hidden={chromeHidden}
          onClick={() => setAnimationPlaying((value) => !value)}
        />
      ) : null}
      <GarageScene
        config={page.scene}
        interiorOpen={interiorOpen}
        sceneScaled={sceneScaled}
        animationPlaying={animationPlaying && !interiorOpen}
      />
      <div id="overlay" className={overlayActive ? "active" : undefined} />
      <ArButton arSrc={page.arSrc} qrSrc={page.qrSrc} />
      {page.panoramaHtml ? <Panorama markup={page.panoramaHtml} /> : null}
    </>
  );
}
