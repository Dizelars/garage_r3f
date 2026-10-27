import { useEffect, useRef, useState } from "react";
import "@google/model-viewer";

const models: Record<string, { model: string; page: string; photo: string }> = {
  moto: { model: "moto/moto.gltf", page: "moto.html", photo: "media/images/modelPage/slider/moto.png" },
  pickup: { model: "pickup/untitled.gltf", page: "pickup.html", photo: "media/images/modelPage/slider/pickup.png" },
  bus: { model: "bus/bus.gltf", page: "bus.html", photo: "media/images/modelPage/slider/bus.png" },
  kamaz: { model: "kamaz/kamaz.gltf", page: "kamaz.html", photo: "media/images/modelPage/slider/kamaz.png" },
  kater: { model: "kater/kater.gltf", page: "kater.html", photo: "media/images/modelPage/slider/kater.png" },
  moskvich: { model: "moskvich/moskvich.gltf", page: "moskvich.html", photo: "media/images/modelPage/slider/moskvich.png" },
  velo: { model: "velo/bicycle.gltf", page: "velo.html", photo: "media/images/modelPage/slider/velo.png" },
};

export function ArPage() {
  const viewerRef = useRef<ModelViewerElement>(null);
  const [opened, setOpened] = useState(false);
  const params = new URLSearchParams(window.location.search);
  const model = models[params.get("armodel") ?? ""];

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "module";
    script.src = "./libraries/lottie/lottie.js";
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);

  useEffect(() => {
    const start = window.setTimeout(() => {
      viewerRef.current?.activateAR();
      window.setTimeout(() => setOpened(true), 15000);
    }, 100);
    return () => window.clearTimeout(start);
  }, []);

  return (
    <>
      <div id="div_mv">
        <model-viewer
          ref={viewerRef}
          className="google_viewer"
          ar
          ar-placement="floor"
          ar-modes="scene-viewer webxr quick-look"
          camera-controls
          src={model ? `https://garage-codd.ru/models/${model.model}` : undefined}
        />
      </div>
      <div className="link_to_page">
        <a href={model?.page ?? "./index.html"}>На страницу с моделью</a>
      </div>
      <div className={opened ? "AR_loading AR_opened" : "AR_loading"}>
        <div className="AR_loading_wrapper">
          <p className="text">Подготавливаем показ модели в дополненной реальности</p>
          <dotlottie-player
            className="lottie"
            src="./libraries/lottie/lottie.json"
            background="transparent"
            speed="1"
            style={{ width: "150px" }}
            loop
            autoplay
          />
        </div>
      </div>
      <div className="model_picture">
        <img alt="Транспортное средство ЦОДД" src={model?.photo} fetchPriority="high" />
        <div className="gradient gradient_left" />
        <div className="gradient gradient_right" />
      </div>
    </>
  );
}
