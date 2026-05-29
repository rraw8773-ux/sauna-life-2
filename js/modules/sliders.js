/*
 * File purpose: initialize product card galleries with SlickSlider.
 */

const DESKTOP_MEDIA_QUERY = "(hover: hover)";
const ZOOM_SCALE = 3;
const sliderStates = new WeakMap();
const zoomedSliders = new Set();

let escapeHandlerBound = false;

const isScopeNode = (value) =>
  value instanceof Document || value instanceof Element;

const getScope = (root) => (isScopeNode(root) ? root : document);

const resolveSliders = (root) => {
  const scope = getScope(root);

  if (scope instanceof Element && scope.matches(".js-product-card-slider")) {
    return [scope];
  }

  return Array.from(scope.querySelectorAll(".js-product-card-slider"));
};

const clampPercent = (value) => Math.max(0, Math.min(100, value));

const getFramePercent = (frame, event) => {
  const rect = frame.getBoundingClientRect();
  
  let clientX = event.clientX;
  let clientY = event.clientY;

  if (event.touches && event.touches[0]) {
    clientX = event.touches[0].clientX;
    clientY = event.touches[0].clientY;
  } else if (event.changedTouches && event.changedTouches[0]) {
    clientX = event.changedTouches[0].clientX;
    clientY = event.changedTouches[0].clientY;
  }

  const x = rect.width ? ((clientX - rect.left) / rect.width) * 100 : 50;
  const y = rect.height ? ((clientY - rect.top) / rect.height) * 100 : 50;

  return {
    x: clampPercent(x),
    y: clampPercent(y),
  };
};

const applyZoomOrigin = (image, frame, event) => {
  const point = getFramePercent(frame, event);
  image.style.transformOrigin = `${point.x}% ${point.y}%`;
};

const ensureEscapeHandler = () => {
  if (escapeHandlerBound) {
    return;
  }

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    zoomedSliders.forEach((slider) => resetZoom(slider));
  });

  // Tap or click outside active zoomed frame to reset zoom
  const dismissZoom = (event) => {
    zoomedSliders.forEach((slider) => {
      const state = sliderStates.get(slider);
      if (state?.isZoomed && state.activeFrame && !state.activeFrame.contains(event.target)) {
        resetZoom(slider);
      }
    });
  };

  document.addEventListener("touchstart", dismissZoom);
  document.addEventListener("mousedown", dismissZoom);

  escapeHandlerBound = true;
};

function resetZoom(slider) {
  const state = sliderStates.get(slider);

  if (!state?.isZoomed) {
    return;
  }

  if (state.activeFrame && state.handleZoomMove) {
    state.activeFrame.removeEventListener("mousemove", state.handleZoomMove);
    state.activeFrame.removeEventListener("touchmove", state.handleZoomMove);
  }

  if (state.activeFrame && state.handleZoomLeave) {
    state.activeFrame.removeEventListener("mouseleave", state.handleZoomLeave);
  }

  if (state.activeImage) {
    state.activeImage.style.transform = "";
    state.activeImage.style.transformOrigin = "";
  }

  if (state.activeFrame) {
    state.activeFrame.classList.remove("is-zoomed");
  }

  state.card?.classList.remove("is-zooming");
  state.isZoomed = false;
  state.activeFrame = null;
  state.activeImage = null;
  state.handleZoomMove = null;
  state.handleZoomLeave = null;

  zoomedSliders.delete(slider);
}

const activateZoom = (slider, image, frame, event) => {
  const state = sliderStates.get(slider);

  if (!state) {
    return;
  }

  resetZoom(slider);

  state.handleZoomMove = (moveEvent) => {
    if (moveEvent.type === "touchmove" && moveEvent.cancelable) {
      moveEvent.preventDefault(); // Stop webpage scrolling during zoom navigation
    }
    applyZoomOrigin(image, frame, moveEvent);
  };
  state.handleZoomLeave = () => {
    resetZoom(slider);
  };

  applyZoomOrigin(image, frame, event);
  image.style.transform = `scale(${ZOOM_SCALE})`;
  frame.classList.add("is-zoomed");
  state.card?.classList.add("is-zooming");
  
  frame.addEventListener("mousemove", state.handleZoomMove);
  frame.addEventListener("mouseleave", state.handleZoomLeave);
  frame.addEventListener("touchmove", state.handleZoomMove, { passive: false });

  state.isZoomed = true;
  state.activeFrame = frame;
  state.activeImage = image;

  zoomedSliders.add(slider);
};

const bindZoom = (slider) => {
  slider.addEventListener("dblclick", (event) => {
    const image = event.target.closest(".product-card__image");

    if (!image || !slider.contains(image)) {
      return;
    }

    const frame = image.closest(".product-card__image-frame");
    const state = sliderStates.get(slider);

    if (!frame || !state) {
      return;
    }

    if (state.isZoomed && state.activeImage === image) {
      resetZoom(slider);
      return;
    }

    activateZoom(slider, image, frame, event);
  });

  // Custom double tap for mobile touch screens
  let lastTapTime = 0;
  slider.addEventListener("touchstart", (event) => {
    const image = event.target.closest(".product-card__image");
    if (!image || !slider.contains(image)) {
      return;
    }

    if (event.touches.length > 1) return; // ignore multi-touch pinch
    const now = performance.now();
    const timespan = now - lastTapTime;

    if (timespan < 300 && timespan > 0) {
      event.preventDefault(); // prevent native double-tap page zoom
      
      const frame = image.closest(".product-card__image-frame");
      const state = sliderStates.get(slider);

      if (!frame || !state) {
        return;
      }

      if (state.isZoomed && state.activeImage === image) {
        resetZoom(slider);
        return;
      }

      activateZoom(slider, image, frame, event);
    }
    lastTapTime = now;
  }, { passive: false });
};

const bindHoverPreview = (gallery, slider, $slider, state) => {
  if (!state.isDesktop || state.originalSlideCount <= 1) {
    return;
  }

  gallery.addEventListener("mousemove", (event) => {
    if (state.isZoomed) {
      return;
    }

    const rect = gallery.getBoundingClientRect();
    const width = rect.width;

    if (!width) {
      return;
    }

    const x = event.clientX - rect.left;
    const zoneWidth = width / state.originalSlideCount;
    const maxIndex = state.originalSlideCount - 1;
    const nextIndex = Math.max(0, Math.min(maxIndex, Math.floor(x / zoneWidth)));

    if (nextIndex === state.hoverIndex) {
      return;
    }

    state.hoverIndex = nextIndex;
    $slider.slick("slickGoTo", nextIndex, true);
  });

  gallery.addEventListener("mouseleave", () => {
    resetZoom(slider);
    state.hoverIndex = 0;
    $slider.slick("slickGoTo", 0, true);
  });
};

const createSliderState = (gallery, slider) => ({
  card: gallery.closest(".product-card"),
  gallery,
  slider,
  originalSlideCount: Array.from(slider.children).filter((child) =>
    child.classList.contains("product-card__slide"),
  ).length,
  isDesktop: window.matchMedia(DESKTOP_MEDIA_QUERY).matches,
  isZoomed: false,
  activeFrame: null,
  activeImage: null,
  handleZoomMove: null,
  handleZoomLeave: null,
  hoverIndex: 0,
});

const initSingleSlider = (slider) => {
  if (slider.classList.contains("slick-initialized")) {
    return;
  }

  const gallery = slider.closest(".product-card__gallery");
  const pagination = gallery?.querySelector(".product-card__pagination");

  if (!gallery || !pagination) {
    return;
  }

  const state = createSliderState(gallery, slider);
  const $slider = window.jQuery(slider);

  sliderStates.set(slider, state);

  $slider.on("beforeChange.catalogProductCard", () => {
    resetZoom(slider);
  });

  $slider.slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    arrows: false,
    dots: true,
    appendDots: pagination,
    adaptiveHeight: false,
    waitForAnimate: false,
    speed: 300,
    swipe: !state.isDesktop,
    draggable: !state.isDesktop,
    touchMove: !state.isDesktop,
    customPaging: () =>
      '<button type="button" aria-label="Show image"></button>',
  });

  bindZoom(slider);
  bindHoverPreview(gallery, slider, $slider, state);

  slider.addEventListener("mouseleave", () => {
    resetZoom(slider);
  });
};

export function initSliders(root = document) {
  if (!window.jQuery || !window.jQuery.fn || !window.jQuery.fn.slick) {
    return;
  }

  ensureEscapeHandler();

  resolveSliders(root).forEach((slider) => {
    initSingleSlider(slider);
  });
}
