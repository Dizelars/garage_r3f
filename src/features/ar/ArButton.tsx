import { useRef, useState } from "react";
import "@google/model-viewer";

type ArButtonProps = {
  arSrc: string;
  qrSrc: string;
};

type PopupName = "qr" | "support" | null;

export function ArButton({ arSrc, qrSrc }: ArButtonProps) {
  const viewerRef = useRef<ModelViewerElement>(null);
  const [loading, setLoading] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [popup, setPopup] = useState<PopupName>(null);
  const [qrVisibility, setQrVisibility] = useState<"hidden" | "visible">("hidden");
  const [supportVisibility, setSupportVisibility] = useState<"hidden" | "visible">("hidden");
  const scrollPosition = useRef(0);

  const lockScroll = () => {
    scrollPosition.current = window.scrollY;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollPosition.current}px`;
    document.body.style.width = "100%";
  };

  const unlockScroll = () => {
    document.body.style.removeProperty("overflow");
    document.body.style.removeProperty("position");
    document.body.style.removeProperty("top");
    document.body.style.removeProperty("width");
    window.scrollTo(0, scrollPosition.current);
  };

  const openPopup = (name: Exclude<PopupName, null>) => {
    setHidden(true);
    setPopup(name);
    if (name === "qr") {
      setQrVisibility("visible");
    } else {
      setSupportVisibility("visible");
    }
    lockScroll();
  };

  const closePopup = () => {
    setPopup(null);
    setHidden(false);
    window.setTimeout(() => {
      setQrVisibility("hidden");
      setSupportVisibility("hidden");
    }, 450);
    unlockScroll();
  };

  const handleClick = () => {
    setLoading(true);
    const viewer = viewerRef.current;
    if (viewer?.canActivateAR) {
      viewer.activateAR();
      window.setTimeout(() => {
        setLoading(false);
      }, 5000);
      return;
    }

    setLoading(false);
    if (window.innerWidth < 1200) {
      openPopup("support");
      return;
    }
    openPopup("qr");
  };

  const buttonClass = ["pulse_wrapper", loading ? "loading" : "", hidden ? "hidden" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <div className={buttonClass} onClick={handleClick}>
        <div className="pulse_media">
          <img className="pulse_img" src="media/images/modelPage/AR/AR-cube.svg" alt="AR" />
          <svg
            version="1.1"
            id="loader-1"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="24px"
            height="24px"
            viewBox="0 0 50 50"
          >
            <path
              fill="#fff"
              d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z"
            >
              <animateTransform
                attributeType="xml"
                attributeName="transform"
                type="rotate"
                from="0 25 25"
                to="360 25 25"
                dur="0.6s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
          <img className="pulse_img" src="media/images/modelPage/AR/AR.svg" alt="AR" />
        </div>
        <div className="pulse" />
      </div>

      <div
        className={popup === "qr" ? "qrCode-popup popup_design active" : "qrCode-popup popup_design"}
        style={{ visibility: qrVisibility }}
      >
        <div className="qrCode-popup_wrapper popup_wrapper">
          <p className="title">Дополненная реальность</p>
          <img className="qr_code" src={qrSrc} alt="QR-код" />
          <p className="description">Наведите камеру на&nbsp;QR-код.</p>
          <div className="closeButton" onClick={closePopup}>Закрыть</div>
        </div>
      </div>

      <div
        className={popup === "support" ? "arSupport-popup popup_design active" : "arSupport-popup popup_design"}
        style={{ visibility: supportVisibility }}
      >
        <div className="arSupport-popup_wrapper popup_wrapper">
          <p className="title">Откройте страницу в&nbsp;браузере</p>
          <p className="description">
            В&nbsp;данный момент Telegram не&nbsp;поддерживает дополненную реальность. Откройте сайт в&nbsp;вашем браузере по&nbsp;умолчанию, чтобы перейти к&nbsp;просмотру модели в&nbsp;AR
          </p>
          <div className="closeButton" onClick={closePopup}>Закрыть</div>
        </div>
      </div>

      <model-viewer
        ref={viewerRef}
        id="pageWithModel"
        className="google_viewer"
        camera-controls
        ar
        ar-modes="scene-viewer webxr quick-look"
        src={arSrc}
        alt="AR 3D-model"
      />
    </>
  );
}
