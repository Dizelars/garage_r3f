import { useEffect } from "react";
import Swiper from "swiper";
import { FreeMode, Navigation } from "swiper/modules";
import type { GallerySlide } from "entities/model/types";

type FleetGalleryProps = {
  slides: GallerySlide[];
  hidden: boolean;
  sliderHidden: boolean;
  transform: string | undefined;
  arrowRotated: boolean;
  onToggle: () => void;
  onSlideClick: (index: number) => void;
  activeIndex: number;
};

export function FleetGallery({
  slides,
  hidden,
  sliderHidden,
  transform,
  arrowRotated,
  onToggle,
  onSlideClick,
  activeIndex,
}: FleetGalleryProps) {
  useEffect(() => {
    const swiper = new Swiper(".swiper_model", {
      modules: [FreeMode, Navigation],
      initialSlide: activeIndex,
      slidesPerView: 1,
      spaceBetween: 2,
      freeMode: true,
      navigation: {
        nextEl: ".next_button",
        prevEl: ".prev_button",
      },
      breakpoints: {
        370: { slidesPerView: 2 },
        770: { slidesPerView: 3 },
        1024: { slidesPerView: 4 },
      },
    });

    const updateButtonVisibility = () => {
      const prevButton = document.querySelector<HTMLButtonElement>(".prev_button");
      const nextButton = document.querySelector<HTMLButtonElement>(".next_button");
      if (prevButton) {
        prevButton.style.display = swiper.isBeginning ? "none" : "block";
      }
      if (nextButton) {
        nextButton.style.display = swiper.isEnd ? "none" : "block";
      }
    };

    updateButtonVisibility();
    swiper.on("reachBeginning", updateButtonVisibility);
    swiper.on("reachEnd", updateButtonVisibility);
    swiper.on("fromEdge", updateButtonVisibility);

    return () => {
      swiper.destroy();
    };
  }, [activeIndex]);

  return (
    <div className={hidden ? "auto_park hidden" : "auto_park"} style={transform ? { transform } : undefined}>
      <div className="container">
        <div className="auto_park_wrapper">
          <div className="auto_park__control" onClick={onToggle}>
            <p className="auto_park__title">Транспорт ЦОДД</p>
            <img
              className={arrowRotated ? "rotate" : undefined}
              src="media/images/modelPage/arrows/auto_park_arrow.svg"
              alt="auto_park_btn"
            />
          </div>
          <div className="auto_park_slider">
            <div className="auto_park_slider-overflow swiper_model">
              <div className="auto_park_slider-wrapper swiper-wrapper">
                {slides.map((slide, index) => (
                  <div
                    className={index === activeIndex ? "gallery_item swiper-slide active" : "gallery_item swiper-slide"}
                    key={`${slide.src}-${slide.href}`}
                    onClick={() => onSlideClick(index)}
                  >
                    <a className="gallery_item_link" href={slide.href}>
                      <picture>
                        <img className="gallery_item-img" src={slide.src} alt={slide.alt} fetchPriority="high" />
                      </picture>
                    </a>
                  </div>
                ))}
              </div>
            </div>
            <div className="auto_park_slider-button">
              <button className={sliderHidden ? "prev_button hidden" : "prev_button"}>
                <img src="media/images/modelPage/arrows/icon-arrow.png" alt="arrow_prev" fetchPriority="high" />
              </button>
              <button className={sliderHidden ? "next_button hidden" : "next_button"}>
                <img src="media/images/modelPage/arrows/icon-arrow.png" alt="arrow_next" fetchPriority="high" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
