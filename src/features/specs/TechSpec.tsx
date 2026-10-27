import type { InteriorContent, OutfitItem } from "entities/model/types";
import { CornerFrame } from "features/specs/CornerFrame";

type TechSpecProps = {
  title: string;
  missionHtml: string;
  outfit: OutfitItem[];
  collapsed: boolean;
  hidden: boolean;
  onToggle: () => void;
};

function hiddenClass(collapsed: boolean, className: string): string {
  return collapsed ? `${className} hidden` : className;
}

export function TechSpec({
  title,
  missionHtml,
  outfit,
  collapsed,
  hidden,
  onToggle,
}: TechSpecProps) {
  const sectionClass = ["tech_spec", collapsed ? "active" : "", hidden ? "hidden" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={sectionClass}>
      <div className={hiddenClass(collapsed, "tech_spec__wrapper")}>
        <div className={hiddenClass(collapsed, "tech_spec__description")}>
          <div className={hiddenClass(collapsed, "tech_spec__description-grid_wrapper")}>
            <div className={hiddenClass(collapsed, "tech_spec__titles")}>
              <div className="text_spec__texts">
                <p className="tech_spec__title">{title}</p>
              </div>
            </div>
            <div className={hiddenClass(collapsed, "tech_spec__mission-panel")}>
              <CornerFrame />
              <p className="tech_spec__text">Задача</p>
            </div>
            <div className={hiddenClass(collapsed, "tech_spec__mission")}>
              <p className="tech_spec__text-descr" dangerouslySetInnerHTML={{ __html: missionHtml }} />
            </div>
            <div className={hiddenClass(collapsed, "tech_spec__outfit-panel")}>
              <CornerFrame />
              <p className="tech_spec__text">Экипировка</p>
            </div>
            <div className={hiddenClass(collapsed, "tech_spec__outfit")}>
              <ul className="tech_spec__outfit-list">
                {outfit.map((item) => (
                  <li className="tech_spec__outfit-item" key={`${item.src}-${item.labelHtml}`}>
                    <div className="tech_spec__outfit-img">
                      <img src={item.src} alt={item.alt} fetchPriority="high" />
                    </div>
                    <span
                      className="tech_spec__outfit-text"
                      dangerouslySetInnerHTML={{ __html: item.labelHtml }}
                    />
                  </li>
                ))}
              </ul>
            </div>
            <div className="tech_spec__button">
              <a className="tech_spec__btn" onClick={onToggle}>
                <span>{collapsed ? "Подробнее" : "Скрыть"}</span>
                <img
                  src="media/images/modelPage/arrows/icon-arrow.svg"
                  alt="icon-arrow"
                  className={collapsed ? undefined : "rotate"}
                  fetchPriority="high"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type InteriorButtonProps = {
  interior: InteriorContent;
  label: string;
  classOn: boolean;
  className: string | undefined;
  onClick: () => void;
};

export function InteriorButton({
  interior,
  label,
  classOn,
  className,
  onClick,
}: InteriorButtonProps) {
  const buttonClass = ["tech_spec__interior", classOn && className].filter(Boolean).join(" ");

  return (
    <div className={buttonClass} id={interior.id} onClick={onClick}>
      <p className="tech_spec__interior-title">{interior.title}</p>
      <div className="tech_spec__interior-wrapper">
        <div className="tech_spec__interior-btn">
          <span className="tech_spec__interior-text">{label}</span>
          <div className="arrow-wrapper">
            <img src="media/images/modelPage/arrows/interior_arrow.svg" alt="interior_arrow" />
          </div>
        </div>
      </div>
    </div>
  );
}
