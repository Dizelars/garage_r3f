import { useEffect } from "react";
import Swiper from "swiper";
import { Pagination } from "swiper/modules";
import {
  isAutoplayVideoScreenSize,
  isElementInViewport,
  observeElementVisibility,
} from "shared/dom/viewport";

const desktopVideo = "media/video/main_desctop.mp4";
const mobileVideo = "media/video/main_mobile.mp4";

function createVideoSource(video: HTMLVideoElement, file: string) {
  const source = document.createElement("source");
  source.src = file;
  source.type = "video/mp4";
  video.appendChild(source);
}

function createIntroVideo() {
  const video = document.querySelector<HTMLVideoElement>("section.main video.preview_video");
  if (!video || video.querySelector("source")) {
    return;
  }

  const tablet = window.innerWidth < 1200;
  const mobile = window.innerWidth < 700;
  const vertical = window.innerHeight > window.innerWidth;
  const file = mobile || (tablet && vertical) ? mobileVideo : desktopVideo;
  createVideoSource(video, file);
  void video.play();
}

function smoothScrollTo(target: string | null) {
  if (!target) {
    return;
  }
  const element = document.querySelector(target);
  if (!element) {
    return;
  }
  window.scroll({
    top: element.getBoundingClientRect().top + window.scrollY,
    behavior: "smooth",
  });
}

function startContentLoader(): () => void {
  const anchor = window.location.hash;
  const preloader = document.querySelector<HTMLElement>(".progress-bar.main");
  const percentEl = document.getElementById("progress-label");
  const barEl = document.getElementById("progress-bar");
  const body = document.querySelector<HTMLElement>("body.main");
  if (!preloader || !percentEl || !barEl || !body || anchor || window.innerWidth > 1370) {
    return () => {};
  }

  let disposed = false;
  let finished = false;
  let done = 0;
  let total = 0;
  const scrollPosition = window.scrollY;
  const removeListeners: Array<() => void> = [];
  let fadeTimer = 0;
  let hideTimer = 0;

  body.style.overflow = "hidden";
  body.style.position = "relative";
  body.style.top = `-${scrollPosition}px`;
  body.style.width = "100%";
  preloader.style.display = "block";
  barEl.style.transition = "width 0.2s linear";

  const unlock = () => {
    body.style.removeProperty("overflow");
    body.style.removeProperty("position");
    body.style.removeProperty("top");
    body.style.removeProperty("width");
    window.scrollTo(0, scrollPosition);
  };

  const paint = (percent: number) => {
    percentEl.textContent = `${percent}%`;
    barEl.style.width = `${percent}%`;
    if (barEl instanceof HTMLProgressElement) {
      barEl.value = percent;
    }
  };

  const hide = () => {
    preloader.style.opacity = "1";
    fadeTimer = window.setInterval(() => {
      const opacity = Number(preloader.style.opacity) - 0.05;
      preloader.style.opacity = String(opacity);
      if (opacity <= 0.05) {
        window.clearInterval(fadeTimer);
        preloader.style.display = "none";
        unlock();
      }
    }, 16);
  };

  const render = () => {
    if (disposed || finished) {
      return;
    }
    const percent = total === 0 ? 100 : Math.max(1, Math.round((done / total) * 100));
    paint(percent);
    if (done >= total) {
      finished = true;
      hideTimer = window.setTimeout(hide, 200);
    }
  };

  const markDone = () => {
    done += 1;
    render();
  };

  const track = (element: HTMLElement, eventName: string, ready: boolean) => {
    total += 1;
    if (ready) {
      done += 1;
      return;
    }
    const onDone = () => {
      element.removeEventListener(eventName, onDone);
      element.removeEventListener("error", onDone);
      markDone();
    };
    element.addEventListener(eventName, onDone);
    element.addEventListener("error", onDone);
    removeListeners.push(() => {
      element.removeEventListener(eventName, onDone);
      element.removeEventListener("error", onDone);
    });
  };

  document.querySelectorAll("img").forEach((image) => {
    if (image.loading === "lazy") {
      return;
    }
    track(image, "load", image.complete);
  });

  const hero = document.querySelector<HTMLVideoElement>("section.main video.preview_video");
  if (hero) {
    track(hero, "canplay", hero.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA);
  }

  total += 1;
  void document.fonts.ready.then(() => {
    if (!disposed) {
      markDone();
    }
  });

  render();

  return () => {
    disposed = true;
    window.clearInterval(fadeTimer);
    window.clearTimeout(hideTimer);
    removeListeners.forEach((remove) => {
      remove();
    });
    unlock();
  };
}

export function useMainPage() {
  useEffect(() => {
    createIntroVideo();
    const stopLoader = startContentLoader();

    const burgerMenus = document.querySelectorAll<HTMLElement>(".burger-menu");
    const burgerBars = document.querySelectorAll<HTMLElement>(".burger-menu .bar");
    const body = document.querySelector<HTMLElement>("body.main");
    const menuButton = document.querySelector<HTMLElement>(".header__menu");
    const menu = document.querySelector<HTMLElement>(".menu");
    const blur = document.querySelector<HTMLElement>(".block_blur");
    const menuAnimation = document.querySelectorAll<HTMLElement>(
      '.menu .menu_navigation .menu_navigation-list li[class^="menu_navigation-"], .menu .menu-media a[class^="media-"]',
    );

    const toggleBurger = (burger: HTMLElement) => {
      burger.classList.toggle("burger-menu--opened");
      burger.classList.toggle("burger-menu--closed");
      burgerBars.forEach((bar) => bar.classList.toggle("close_width"));
    };

    const toggleMenu = () => {
      menu?.classList.toggle("active");
      body?.classList.toggle("overflow");
      blur?.classList.toggle("active");
      menuAnimation.forEach((item) => item.classList.toggle("animation"));
    };

    burgerMenus.forEach((burger) => {
      burger.addEventListener("click", () => toggleBurger(burger));
    });
    menuButton?.addEventListener("click", toggleMenu);

    const navigationLinks = document.querySelectorAll<HTMLAnchorElement>(".menu_navigation-link");
    const addHovered = (link: HTMLAnchorElement) => link.classList.add("hovered");
    const clearHovered = () => navigationLinks.forEach((link) => link.classList.remove("hovered"));

    const onHover = (event: Event) => {
      const hovered = event.currentTarget;
      if (!(hovered instanceof HTMLAnchorElement) || !hovered.parentElement) {
        return;
      }
      clearHovered();
      let previous = hovered.parentElement.previousElementSibling;
      while (previous) {
        previous.querySelector<HTMLAnchorElement>(".menu_navigation-link")?.classList.add("hovered");
        previous = previous.previousElementSibling;
      }
      let next = hovered.parentElement.nextElementSibling;
      while (next) {
        next.querySelector<HTMLAnchorElement>(".menu_navigation-link")?.classList.add("hovered");
        next = next.nextElementSibling;
      }
      addHovered(hovered);
    };

    const closeMenu = (event: Event) => {
      event.preventDefault();
      const link = event.currentTarget;
      if (!(link instanceof HTMLAnchorElement)) {
        return;
      }
      toggleMenu();
      burgerMenus.forEach((burger) => {
        burger.classList.remove("burger-menu--opened");
        burger.classList.add("burger-menu--closed");
      });
      burgerBars.forEach((bar) => bar.classList.remove("close_width"));
      smoothScrollTo(link.getAttribute("href"));
    };

    navigationLinks.forEach((link) => {
      link.addEventListener("mouseover", onHover);
      link.addEventListener("mouseout", clearHovered);
      link.addEventListener("click", closeMenu);
    });

    const previewCleanups: Array<() => void> = [];
    if (window.innerWidth > 1200) {
      document.querySelectorAll<HTMLElement>(".menu_navigation-item").forEach((item) => {
        const preview = item.querySelector<HTMLElement>(".menu_preview-block");
        const video = item.querySelector<HTMLVideoElement>(".menu_preview-video");
        if (!preview || !video) {
          return;
        }
        const onEnter = () => {
          preview.style.display = "block";
          void video.play();
          item.style.zIndex = "5";
        };
        const onLeave = () => {
          preview.style.display = "none";
          video.pause();
          video.currentTime = 0;
          item.style.zIndex = "unset";
        };
        const onMove = (event: MouseEvent) => {
          const rect = item.getBoundingClientRect();
          preview.style.left = `${event.clientX - rect.left - preview.offsetWidth / 2}px`;
          preview.style.top = `${event.clientY - rect.top - preview.offsetHeight - 10}px`;
        };
        item.addEventListener("mouseenter", onEnter);
        item.addEventListener("mouseleave", onLeave);
        item.addEventListener("mousemove", onMove);
        previewCleanups.push(() => {
          item.removeEventListener("mouseenter", onEnter);
          item.removeEventListener("mouseleave", onLeave);
          item.removeEventListener("mousemove", onMove);
        });
      });
    }

    const observers: IntersectionObserver[] = [];
    document.querySelectorAll<HTMLElement>(".garage_model_card").forEach((card) => {
      const video = card.querySelector<HTMLVideoElement>(".slid_img .menu_preview-video");
      const media = card.querySelector<HTMLElement>(".slid_img");
      const picture = card.querySelector<HTMLElement>(".slid_img picture");
      if (!video || !media || !picture) {
        return;
      }
      const show = () => {
        video.style.visibility = "visible";
        void video.play();
        picture.style.visibility = "hidden";
        media.style.background = "#090909 ";
      };
      const hide = () => {
        video.style.visibility = "hidden";
        video.pause();
        video.currentTime = 0;
        picture.style.visibility = "visible";
        media.style.background = "";
      };
      if (isAutoplayVideoScreenSize()) {
        observers.push(observeElementVisibility(card, show, hide));
      } else {
        card.addEventListener("mouseenter", show);
        card.addEventListener("mouseleave", hide);
        previewCleanups.push(() => {
          card.removeEventListener("mouseenter", show);
          card.removeEventListener("mouseleave", hide);
        });
      }
    });

    const onFooterClick = (event: Event) => {
      event.preventDefault();
      const link = event.currentTarget;
      if (link instanceof HTMLAnchorElement) {
        smoothScrollTo(link.getAttribute("href"));
      }
    };
    const footerLinks = document.querySelectorAll<HTMLAnchorElement>("footer.footer_main .footer-menu-links a");
    footerLinks.forEach((link) => link.addEventListener("click", onFooterClick));

    const swiper1 = new Swiper(".swiper1", {
      modules: [Pagination],
      slidesPerView: 1,
      spaceBetween: 20,
      pagination: { el: ".swiper-pagination1", clickable: true },
    });
    const swiper2 = new Swiper(".swiper2", {
      modules: [Pagination],
      slidesPerView: "auto",
      spaceBetween: 20,
      pagination: { el: ".swiper-pagination2", clickable: true },
    });
    const swiper3 = new Swiper(".swiper3", {
      modules: [Pagination],
      slidesPerView: 1,
      spaceBetween: 20,
      pagination: { el: ".swiper-pagination3", clickable: true },
      breakpoints: {
        440: { slidesPerView: "auto", spaceBetween: 20 },
      },
    });

    const moveBefore = (section: HTMLElement) => {
      if (section.classList.contains("help_desk")) {
        const height = 600;
        const top = Math.random() * (section.clientHeight - height);
        section.style.setProperty("--before-top", `${top}px`);
        section.style.setProperty("--before-bottom", `${top + height}px`);
        section.style.setProperty("--before-right", `${Math.random() * 100}%`);
        section.style.setProperty("--before-left", `${Math.random() * 100}%`);
        return;
      }
      section.style.setProperty("--before-top", `${Math.random() * 100}%`);
      section.style.setProperty("--before-bottom", `${Math.random() * 100}%`);
      section.style.setProperty("--before-right", `${Math.random() * 100}%`);
      section.style.setProperty("--before-left", `${Math.random() * 100}%`);
    };

    const sectionTimers = Array.from(document.querySelectorAll<HTMLElement>(
      "section.traffic_patrol, section.situation_centre, section.velo_patrol, section.help_desk",
    )).map((section) => window.setInterval(() => moveBefore(section), 1800));

    const footerContainer = document.querySelector<HTMLElement>("footer.footer_main .container_main");
    const onFooterMove = (event: MouseEvent) => {
      if (!footerContainer) {
        return;
      }
      const rect = footerContainer.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;
      const distance = Math.hypot(offsetX - centerX, offsetY - centerY);
      const maxOpacity = 1;
      const minOpacity = 0.3;
      const range = maxOpacity - minOpacity;
      footerContainer.style.setProperty("--before-opacity", String(Math.max(minOpacity, maxOpacity - (distance / centerX) * range)));
      footerContainer.style.setProperty("--after-opacity", String(Math.max(minOpacity, (distance / centerX) * range)));
    };
    footerContainer?.addEventListener("mousemove", onFooterMove);

    const animateSection = (selector: string) => {
      document.querySelectorAll<HTMLElement>(`${selector} [class*="-animation-"]`).forEach((element) => {
        if (element.classList.contains("animated") || !isElementInViewport(element)) {
          return;
        }
        const delay = Number.parseFloat(window.getComputedStyle(element).animationDelay) || 0;
        element.style.animation = "none";
        element.style.opacity = "0";
        window.setTimeout(() => {
          element.style.animation = "";
          element.classList.add("animated");
        }, delay);
      });
    };

    const onScroll = () => {
      animateSection("section.traffic_patrol");
      animateSection("section.water_patrol");
      animateSection("section.velo_patrol");
      animateSection("section.situation_centre");
      animateSection("section.help_desk");
    };
    window.addEventListener("scroll", onScroll);
    onScroll();

    return () => {
      stopLoader();
      previewCleanups.forEach((cleanup) => cleanup());
      observers.forEach((observer) => observer.disconnect());
      footerLinks.forEach((link) => link.removeEventListener("click", onFooterClick));
      navigationLinks.forEach((link) => {
        link.removeEventListener("mouseover", onHover);
        link.removeEventListener("mouseout", clearHovered);
        link.removeEventListener("click", closeMenu);
      });
      menuButton?.removeEventListener("click", toggleMenu);
      footerContainer?.removeEventListener("mousemove", onFooterMove);
      window.removeEventListener("scroll", onScroll);
      sectionTimers.forEach((timer) => window.clearInterval(timer));
      swiper1.destroy();
      swiper2.destroy();
      swiper3.destroy();
    };
  }, []);
}
