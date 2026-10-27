export function isAutoplayVideoScreenSize(): boolean {
  return window.innerWidth <= 1199;
}

export function isElementInViewport(element: Element): boolean {
  const rect = element.getBoundingClientRect();
  return rect.top >= 0
    && rect.left >= 0
    && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
}

export function observeElementVisibility(
  element: Element,
  onVisible: () => void,
  onHidden: () => void,
): IntersectionObserver {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        onVisible();
      } else {
        onHidden();
      }
    });
  }, {
    root: null,
    rootMargin: "0px",
    threshold: 0,
  });

  observer.observe(element);
  return observer;
}
