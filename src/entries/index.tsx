import { createRoot } from "react-dom/client";
import { MainPage } from "pages/MainPage";
import "swiper/css";
import "swiper/css/pagination";
import "style/mainPage/index.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Не найден #root");
}

createRoot(rootElement).render(<MainPage />);
