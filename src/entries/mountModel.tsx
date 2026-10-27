import { createRoot } from "react-dom/client";
import type { ModelId } from "entities/model/pages";
import { pages } from "entities/model/pages";
import { ModelPage } from "pages/ModelPage";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "style/modelPage.css";

export function mountModel(id: ModelId) {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Не найден #root");
  }

  createRoot(rootElement).render(<ModelPage page={pages[id]} />);
}
