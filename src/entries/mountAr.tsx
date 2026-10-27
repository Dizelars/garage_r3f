import { createRoot } from "react-dom/client";
import { ArPage } from "pages/ArPage";
import "style/default/fonts.css";

export function mountAr() {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Не найден #root");
  }

  createRoot(rootElement).render(<ArPage />);
}
