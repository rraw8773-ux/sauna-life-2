/*
 * Назначение файла: Логика кнопки "Посмотреть все" для фильтров и списков
 */

export function initFiltersMore() {
  document.querySelectorAll(".filters__more").forEach((btn) => {
    // Ищем родительскую группу
    const group = btn.closest(".filters__group");
    if (!group) return;

    let listContainer;
    let listItems = [];

    // Паттерн 1: Кнопка внутри элемента списка li (как в блоке Категории)
    if (btn.closest("li") && btn.closest("ul")) {
      listContainer = btn.closest("ul");
      // Исключаем li, в котором находится сама кнопка
      listItems = Array.from(listContainer.children).filter(
        (child) => !child.contains(btn),
      );
    }
    // Паттерн 2: Кнопка является сестринским элементом по отношению к контейнеру со списком (как в блоке Производители)
    else if (btn.previousElementSibling) {
      listContainer = btn.previousElementSibling;
      listItems = Array.from(listContainer.children);
    }

    if (!listContainer || listItems.length === 0) return;

    // Определяем количество видимых элементов (по умолчанию 4, или из атрибута data-visible обертки)
    const visibleCount = group.hasAttribute("data-visible")
      ? parseInt(group.getAttribute("data-visible"), 10)
      : 4;

    let isExpanded = false;

    function updateVisibility() {
      listItems.forEach((item, index) => {
        if (index >= visibleCount && !isExpanded) {
          item.classList.add("filters__item--hidden");
        } else {
          item.classList.remove("filters__item--hidden");
        }
      });
      btn.textContent = isExpanded ? "Скрыть" : "Посмотреть все";
    }

    // Логика инициализации
    if (listItems.length > visibleCount) {
      updateVisibility();
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        isExpanded = !isExpanded;
        updateVisibility();
      });
    } else {
      // Скрываем кнопку, если элементов меньше или равно количеству для отображения
      btn.style.display = "none";
      if (btn.closest("li") && btn.closest("ul")) {
        btn.closest("li").style.display = "none";
      }
    }
  });
}
