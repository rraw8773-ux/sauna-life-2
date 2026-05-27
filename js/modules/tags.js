/*
 * Назначение файла: Логика работы тегов (раскрытие/скрытие) и генерация оффканваса
 */

/**
 * Заполняет вертикальный список в оффканвасе тегов на основе элементов из .tags__list.
 * Это позволяет не дублировать контент в HTML.
 * @param {HTMLElement} sourceList - основной список .tags__list
 * @param {HTMLElement} menuTarget - целевой ul.tags-menu в оффканвасе
 */
function populateTagsOffcanvas(sourceList, menuTarget) {
  if (!sourceList || !menuTarget) return;

  // Берём все li-теги кроме кнопки «Все» (tags__all-btn) и кнопки «Еще» (tags__item--more)
  const items = Array.from(
    sourceList.querySelectorAll(".tags__item:not(.tags__item--more)"),
  ).filter((item) => !item.querySelector(".tags__all-btn"));

  menuTarget.innerHTML = ""; // очищаем на случай повторного вызова

  items.forEach((item) => {
    const sourceLink = item.querySelector(".tags__link");
    if (!sourceLink) return;

    const icon = sourceLink.querySelector(".tags__icon");
    const href = sourceLink.getAttribute("href") || "#";

    // Собираем текст (игнорируем дочерние элементы-изображения)
    let text = "";
    sourceLink.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        text += node.textContent.trim();
      }
    });

    // Создаём элемент вертикального списка
    const li = document.createElement("li");
    li.className = "tags-menu__item";

    const a = document.createElement("a");
    a.href = href;
    a.className = "tags-menu__link";

    if (icon) {
      const img = document.createElement("img");
      img.src = icon.src;
      img.alt = "";
      img.className = "tags-menu__icon";
      a.appendChild(img);
    } else {
      // Для брендов без иконки — небольшой placeholder
      const placeholder = document.createElement("span");
      placeholder.className = "tags-menu__icon-placeholder";
      a.appendChild(placeholder);
    }

    const span = document.createElement("span");
    span.textContent = text;
    a.appendChild(span);

    li.appendChild(a);
    menuTarget.appendChild(li);
  });
}

export function initTags() {
  const lists = document.querySelectorAll(".tags__list");

  lists.forEach((list) => {
    // Для каждого списка проверяем, есть ли связанный оффканвас для автозаполнения
    const allBtn = list.querySelector(".tags__all-btn");
    if (allBtn) {
      const targetId = allBtn.dataset.target;
      if (targetId) {
        const offcanvasMenu = document.getElementById(targetId + "-menu");
        if (offcanvasMenu) {
          populateTagsOffcanvas(list, offcanvasMenu);
        }
      }
    }

    const moreBtnItem = list.querySelector(".tags__item--more");
    if (!moreBtnItem) return;

    const moreBtn = moreBtnItem.querySelector("button");
    const items = Array.from(
      list.querySelectorAll(".tags__item:not(.tags__item--more)"),
    );

    function updateTagsVisibility() {
      // Сбрасываем скрытие для расчета
      items.forEach((item) => item.classList.remove("tags__item--hidden"));

      if (list.classList.contains("tags__list--expanded")) {
        moreBtn.textContent = "Скрыть";
        return; // Показываем все
      } else {
        moreBtn.textContent = "Еще";
      }

      if (!items.length) return;
      const firstTop = items[0].offsetTop;

      // На мобильных горизонтальный скролл, логика скрытия не нужна
      if (window.innerWidth < 768) {
        return;
      }

      // Скрываем все элементы, которые перешли на вторую строку исходя из их offsetTop
      for (let i = 0; i < items.length; i++) {
        if (items[i].offsetTop > firstTop) {
          items[i].classList.add("tags__item--hidden");
        }
      }

      // Дополнительно проверяем, не вытолкнута ли сама кнопка "Еще" на вторую строку
      let safeBreak = 200; // защита от зависания
      while (moreBtnItem.offsetTop > firstTop && safeBreak > 0) {
        const visibleItems = items.filter(
          (item) => !item.classList.contains("tags__item--hidden"),
        );
        if (visibleItems.length > 0) {
          visibleItems[visibleItems.length - 1].classList.add(
            "tags__item--hidden",
          );
        } else {
          break;
        }
        safeBreak--;
      }
    }

    // Слушатель на кнопку "Еще"
    moreBtn.addEventListener("click", (e) => {
      e.preventDefault();
      list.classList.toggle("tags__list--expanded");
      updateTagsVisibility();
    });

    // Расчет при загрузке
    // Используем setTimeout, чтобы дождаться отработки CSS стилей и шрифтов
    setTimeout(updateTagsVisibility, 50);

    // Расчет при ресайзе с небольшой задержкой (debounce)
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        updateTagsVisibility();
      }, 50);
    });
  });
}
