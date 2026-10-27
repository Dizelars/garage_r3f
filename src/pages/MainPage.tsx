import { MainMarkup } from "pages/main/MainMarkup";
import { useMainPage } from "pages/main/useMainPage";

export function MainPage() {
  useMainPage();
  return <MainMarkup />;
}
