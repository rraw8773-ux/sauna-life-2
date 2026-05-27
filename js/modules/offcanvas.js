/*
 * Назначение файла: Логика бокового меню (off-canvas) для фильтров и навигации
 * Поддержка свайпа вниз для закрытия (как в нативных приложениях)
 */

export const initOffcanvas = () => {
  const offcanvasElements = document.querySelectorAll(".offcanvas");
  const toggleButtons = document.querySelectorAll('[data-toggle="offcanvas"]');
  const closeButtons = document.querySelectorAll("[data-offcanvas-close]");

  if (!offcanvasElements.length && !toggleButtons.length) return;

  // Создадим backdrop, если его нет
  let backdrop = document.querySelector(".offcanvas-backdrop");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.className = "offcanvas-backdrop";
    document.body.appendChild(backdrop);
  }

  const openOffcanvas = (target) => {
    if (!target) return;
    target.classList.add("is-active");
    backdrop.classList.add("is-active");
    document.body.style.overflow = "hidden";
    target.style.transform = ""; // reset transition
    target.style.transition = "";
  };

  const closeOffcanvas = () => {
    offcanvasElements.forEach((el) => {
      el.classList.remove("is-active");
      el.style.transform = ""; // reset transformation if any
      el.style.transition = "";
    });
    backdrop.classList.remove("is-active");
    document.body.style.overflow = ""; // reset overflow
  };

  toggleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      if (targetId) {
        const target = document.getElementById(targetId);
        openOffcanvas(target);
      }
    });
  });

  closeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      closeOffcanvas();
    });
  });

  backdrop.addEventListener("click", () => {
    closeOffcanvas();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) {
      closeOffcanvas();
    }
  });

  // Логика свайпа: вверх — развернуть на весь экран, вниз — закрыть
  offcanvasElements.forEach((offcanvas) => {
    const header = offcanvas.querySelector(".offcanvas__header");
    if (!header) return;

    let startY = 0;
    let currentY = 0;
    let isDragging = false;
    let startTime = 0;
    let isExpanded = false; // текущее состояние: развёрнут или нет
    let startHeight = 0;
    let resizeTimeout = null;

    /**
     * Раскрывает оффканвас на всю высоту экрана (100dvh)
     */
    const expandOffcanvas = () => {
      isExpanded = true;
      offcanvas.classList.add("is-expanded");
      offcanvas.style.transition = ""; // fallback to CSS transition
      offcanvas.style.transform = "";
      offcanvas.style.height = ""; // let css handle height: 100dvh
      offcanvas.style.maxHeight = ""; // let css handle max-height: 100dvh
    };

    /**
     * Возвращает оффканвас в стандартное состояние (80vh)
     */
    const collapseOffcanvas = () => {
      isExpanded = false;
      offcanvas.classList.remove("is-expanded");
      offcanvas.style.transition = ""; // fallback to CSS transition
      offcanvas.style.transform = "";
      offcanvas.style.height = "";
      offcanvas.style.maxHeight = "";
    };

    header.addEventListener(
      "touchstart",
      (e) => {
        if (e.touches.length > 1) return;

        startY = e.touches[0].clientY;
        currentY = startY;
        isDragging = true;
        startTime = Date.now();
        startHeight = offcanvas.offsetHeight;
        if (resizeTimeout) clearTimeout(resizeTimeout);

        // Отключаем CSS-анимацию для прямого отклика под пальцем
        offcanvas.style.transition = "none";
      },
      { passive: true },
    );

    header.addEventListener(
      "touchmove",
      (e) => {
        if (!isDragging) return;

        currentY = e.touches[0].clientY;
        const deltaY = currentY - startY;

        // --- Свайп вниз ---
        if (deltaY > 0) {
          // Тянем вниз — сдвигаем оффканвас вниз
          e.preventDefault();
          offcanvas.style.transform = `translateY(${deltaY}px)`;
        } else if (deltaY < 0 && !isExpanded) {
          // Тянем вверх — увеличиваем физическую высоту окна под пальцем
          e.preventDefault();
          const diff = Math.abs(deltaY);
          offcanvas.style.height = `${startHeight + diff}px`;
          offcanvas.style.maxHeight = "none"; // временно снимаем CSS ограничение (80vh)
        }
      },
      { passive: false },
    );

    header.addEventListener("touchend", () => {
      if (!isDragging) return;
      isDragging = false;

      const deltaY = currentY - startY;
      const duration = Date.now() - startTime;
      const velocity = deltaY / duration; // px/ms

      // --- Свайп вниз ---
      if (deltaY > 0) {
        if (isExpanded) {
          // Если тянут резко (velocity > 0.85) или очень далеко (более 300px) — закрываем сразу
          if (velocity > 0.85 || deltaY > 300) {
            closeOffcanvas();
          }
          // Иначе, если плавно потянули вниз (более 80px или скорость больше 0.3) — возвращаем в дефолт (80vh)
          else if (deltaY > 80 || velocity > 0.3) {
            collapseOffcanvas();
          }
          // Иначе (сдвинули чуть-чуть) — возвращаем развернутым
          else {
            offcanvas.style.transition = "";
            offcanvas.style.transform = "";
          }
        } else {
          // Если он в дефолтном (обычном) состоянии — закрываем
          if (deltaY > 80 || (velocity > 0.5 && deltaY > 30)) {
            closeOffcanvas();
          } else {
            offcanvas.style.transition = "";
            offcanvas.style.transform = "";
          }
        }
        return;
      }

      // --- Свайп вверх: развернуть на весь экран ---
      if (deltaY < -60 || (velocity < -0.3 && deltaY < -20)) {
        expandOffcanvas();
        return;
      }

      // --- Ни то, ни другое: возврат на место ---
      if (deltaY < 0 && !isExpanded) {
        // Захлебнувшийся свайп вверх: плавно возвращаем обратно к 80vh
        offcanvas.style.transition = "height 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
        offcanvas.style.height = `${startHeight}px`; // возврат к исходной высоте

        resizeTimeout = setTimeout(() => {
          if (!isDragging && !isExpanded) {
            offcanvas.style.transition = "";
            offcanvas.style.height = "";
            offcanvas.style.maxHeight = "";
            offcanvas.style.transform = "";
          }
        }, 300);
      } else {
        offcanvas.style.transition = "";
        offcanvas.style.transform = "";
      }
    });

    // При закрытии сбрасываем expanded-состояние
    offcanvas.addEventListener("transitionend", () => {
      if (!offcanvas.classList.contains("is-active")) {
        offcanvas.classList.remove("is-expanded");
        isExpanded = false;
        offcanvas.style.height = "";
        offcanvas.style.maxHeight = "";
      }
    });
  });
};
