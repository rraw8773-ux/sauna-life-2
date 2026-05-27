/*
 * Назначение файла: Логика мобильного fullscreen-меню каталога
 * — Открытие под хедером (header остаётся видимым)
 * — Свайп вниз для закрытия (drag handle + header)
 * — Drill-down навигация (неограниченная вложенность)
 * — Вкладки: Каталог / Услуги / Контакты
 */

export function initMobileCatalogMenu() {
  const btn = document.getElementById("mobile-catalog-btn");
  const menu = document.getElementById("mobile-catalog-menu");
  if (!btn || !menu) return;

  const closeBtn = menu.querySelector(".mcm__close");
  const dragHandle = menu.querySelector(".mcm__drag-handle");
  const mcmHeader = menu.querySelector(".mcm__header");
  const tabs = menu.querySelectorAll(".mcm__tab");
  const tabPanels = menu.querySelectorAll(".mcm__tab-panel");
  const catalogPages = menu.querySelector(".mcm__pages");
  const contactsContainer = menu.querySelector(".mcm__contacts");

  let pageStack = [];

  // ── Данные ────────────────────────────────────────
  const catalogData = parseCatalogData();
  const servicesData = parseServicesData();

  buildRootPage();
  cloneContacts();
  updateTopOffset();

  // ── Позиционирование под хедером ───────────────────
  // .header имеет display:contents → getBoundingClientRect() возвращает 0.
  // Поэтому измеряем нижний край последнего видимого дочернего блока.
  function updateTopOffset() {
    const headerParts = document.querySelectorAll(
      ".header__top, .header__middle, .header__bottom",
    );
    let maxBottom = 0;
    headerParts.forEach((el) => {
      // Пропускаем скрытые элементы (display:none или нулевая высота)
      if (el.offsetParent === null && el.offsetHeight === 0) return;
      const bottom = el.getBoundingClientRect().bottom;
      if (bottom > maxBottom) maxBottom = bottom;
    });
    menu.style.setProperty("--mcm-top", maxBottom + "px");
  }

  // Обновляем при скролле (sticky header меняет свой размер)
  window.addEventListener("scroll", updateTopOffset, { passive: true });
  window.addEventListener("resize", () => {
    updateTopOffset();
    if (window.innerWidth >= 768) closeMenu();
  });

  // ── Открытие / Закрытие ────────────────────────────
  function openMenu() {
    updateTopOffset();
    menu.classList.add("is-open");
    btn.classList.add("is-active");
  }

  function closeMenu() {
    menu.classList.remove("is-open");
    btn.classList.remove("is-active");
    menu.style.transform = "";
    menu.style.transition = "";
    setTimeout(resetDrillDown, 350);
  }

  function toggleMenu() {
    menu.classList.contains("is-open") ? closeMenu() : openMenu();
  }

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    toggleMenu();
  });

  if (closeBtn) closeBtn.addEventListener("click", () => closeMenu());

  // ── Свайп вниз для закрытия ────────────────────────
  // Применяем к drag handle и шапке меню (как в offcanvas.js)
  [dragHandle, mcmHeader].forEach((el) => {
    if (!el) return;

    let startY = 0;
    let currentY = 0;
    let isDragging = false;
    let startTime = 0;

    el.addEventListener(
      "touchstart",
      (e) => {
        if (e.touches.length > 1) return;
        startY = e.touches[0].clientY;
        currentY = startY;
        isDragging = true;
        startTime = Date.now();
        menu.style.transition = "none";
      },
      { passive: true },
    );

    el.addEventListener(
      "touchmove",
      (e) => {
        if (!isDragging) return;
        currentY = e.touches[0].clientY;
        const deltaY = currentY - startY;
        if (deltaY > 0) {
          e.preventDefault();
          menu.style.transform = `translateY(${deltaY}px)`;
        }
      },
      { passive: false },
    );

    el.addEventListener("touchend", () => {
      if (!isDragging) return;
      isDragging = false;

      const deltaY = currentY - startY;
      const duration = Date.now() - startTime;
      const velocity = deltaY / duration;

      menu.style.transition =
        "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.35s";

      if (deltaY > 100 || (velocity > 0.5 && deltaY > 30)) {
        closeMenu();
      } else {
        menu.style.transform = "";
      }
    });
  });

  // ── Вкладки ────────────────────────────────────────
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;
      tabs.forEach((t) => t.classList.remove("is-active"));
      tabPanels.forEach((p) => p.classList.remove("is-active"));
      tab.classList.add("is-active");
      const panel = menu.querySelector(
        `.mcm__tab-panel[data-panel="${target}"]`,
      );
      if (panel) panel.classList.add("is-active");
    });
  });

  // ── Парсинг данных из десктопного каталога ───────────
  function parseCatalogData() {
    const modal = document.getElementById("catalog-modal");
    if (!modal) return [];

    // Расширенные данные для категорий с вложенностью
    const nestedData = getNestedCategoryData();

    const categories = [];
    const seen = new Set();
    const categoryLinks = modal.querySelectorAll(
      ".catalog-modal__category-link",
    );

    categoryLinks.forEach((link) => {
      const catId = link.dataset.category;
      if (!catId || seen.has(catId)) return;
      seen.add(catId);

      const iconEl = link.querySelector(".catalog-modal__category-icon");
      const textEl = link.querySelector(".catalog-modal__category-text");
      const isAccent = link.classList.contains(
        "catalog-modal__category-link--accent",
      );
      const panel = modal.querySelector(
        `.catalog-modal__panel[data-panel="${catId}"]`,
      );

      let subcategories = [];

      // Если для этой категории есть ручные данные — используем их
      if (nestedData[catId]) {
        subcategories = nestedData[catId];
      } else if (panel) {
        // Иначе парсим из десктопного DOM
        const columns = panel.querySelectorAll(".catalog-modal__column");
        columns.forEach((col) => {
          if (col.querySelector(".catalog-modal__promo")) return;
          const colTitle = col.querySelector(".catalog-modal__column-title");
          if (
            colTitle &&
            colTitle.textContent.trim().toUpperCase().includes("УСЛУГИ")
          )
            return;
          col
            .querySelectorAll(".catalog-modal__subcategory-link")
            .forEach((sub) => {
              const countEl = sub.querySelector(".catalog-modal__count");
              subcategories.push({
                text: sub.textContent
                  .replace(countEl ? countEl.textContent : "", "")
                  .trim(),
                href: sub.getAttribute("href") || "#",
                count: countEl ? countEl.textContent.trim() : null,
                children: [],
              });
            });
        });
      }

      categories.push({
        id: catId,
        text: textEl ? textEl.textContent.trim() : "",
        icon: iconEl ? iconEl.getAttribute("src") : "",
        isAccent,
        subcategories,
      });
    });

    return categories;
  }

  // Расширенные вложенные данные для «Печи для бани» (2 уровня)
  // и «Дровяные печи» (4 уровня)
  function getNestedCategoryData() {
    return {
      pechi: [
        {
          text: "Все печи",
          href: "#",
          count: "1166",
          children: [],
        },
        {
          text: "Дровяные печи",
          href: "#",
          count: "1166",
          children: [
            {
              text: "С закрытой каменкой",
              href: "#",
              count: "342",
              children: [
                {
                  text: "Harvia",
                  href: "#",
                  count: "84",
                  children: [
                    {
                      text: "Harvia 20 SL",
                      href: "#",
                      count: "12",
                      children: [],
                    },
                    {
                      text: "Harvia 22 Duo",
                      href: "#",
                      count: "9",
                      children: [],
                    },
                    {
                      text: "Harvia 36 Pro",
                      href: "#",
                      count: "7",
                      children: [],
                    },
                    {
                      text: "Harvia KIP",
                      href: "#",
                      count: "15",
                      children: [],
                    },
                  ],
                },
                {
                  text: "Tulikivi",
                  href: "#",
                  count: "56",
                  children: [
                    {
                      text: "Classic-серия",
                      href: "#",
                      count: "18",
                      children: [],
                    },
                    {
                      text: "Premium-серия",
                      href: "#",
                      count: "24",
                      children: [],
                    },
                  ],
                },
                {
                  text: "Везувий",
                  href: "#",
                  count: "71",
                  children: [
                    { text: "Легенда", href: "#", count: "22", children: [] },
                    { text: "Скиф", href: "#", count: "19", children: [] },
                    { text: "Ураган", href: "#", count: "30", children: [] },
                  ],
                },
                {
                  text: "Жара",
                  href: "#",
                  count: "28",
                  children: [],
                },
              ],
            },
            {
              text: "С открытой каменкой",
              href: "#",
              count: "218",
              children: [
                {
                  text: "Сетка",
                  href: "#",
                  count: "112",
                  children: [
                    { text: "Костёр", href: "#", count: "34", children: [] },
                    { text: "Гефест", href: "#", count: "28", children: [] },
                    { text: "Фёрингер", href: "#", count: "21", children: [] },
                    { text: "TMF", href: "#", count: "29", children: [] },
                  ],
                },
                {
                  text: "Конвекция",
                  href: "#",
                  count: "106",
                  children: [
                    { text: "Теплодар", href: "#", count: "38", children: [] },
                    { text: "ТМФ", href: "#", count: "42", children: [] },
                    { text: "Тунгуска", href: "#", count: "26", children: [] },
                  ],
                },
              ],
            },
            {
              text: "Чугунные печи",
              href: "#",
              count: "95",
              children: [
                {
                  text: "Отечественные",
                  href: "#",
                  count: "60",
                  children: [
                    { text: "Эверест", href: "#", count: "22", children: [] },
                    { text: "Гефест ПБ", href: "#", count: "18", children: [] },
                  ],
                },
                {
                  text: "Финские",
                  href: "#",
                  count: "35",
                  children: [
                    {
                      text: "Harvia Legend",
                      href: "#",
                      count: "12",
                      children: [],
                    },
                    {
                      text: "IKI Original",
                      href: "#",
                      count: "23",
                      children: [],
                    },
                  ],
                },
              ],
            },
            {
              text: "Печи с баком для воды",
              href: "#",
              count: "127",
              children: [
                {
                  text: "Боковой бак",
                  href: "#",
                  count: "74",
                  children: [
                    { text: "Бак 50 л", href: "#", count: "28", children: [] },
                    { text: "Бак 70 л", href: "#", count: "31", children: [] },
                    { text: "Бак 100 л", href: "#", count: "15", children: [] },
                  ],
                },
                {
                  text: "Навесной бак",
                  href: "#",
                  count: "53",
                  children: [
                    { text: "30 л", href: "#", count: "20", children: [] },
                    { text: "50 л", href: "#", count: "33", children: [] },
                  ],
                },
              ],
            },
          ],
        },
        {
          text: "Электрические печи",
          href: "#",
          count: "1425",
          children: [
            {
              text: "До 8 кВт (до 9 м³)",
              href: "#",
              count: "342",
              children: [
                { text: "Harvia Vega", href: "#", count: "56", children: [] },
                { text: "EOS Bi-O Cubo", href: "#", count: "43", children: [] },
                { text: "Helo Hanko", href: "#", count: "38", children: [] },
              ],
            },
            {
              text: "8–18 кВт (до 20 м³)",
              href: "#",
              count: "487",
              children: [
                { text: "Harvia Globe", href: "#", count: "72", children: [] },
                { text: "Tylo Tron", href: "#", count: "64", children: [] },
                { text: "Helo Roxx", href: "#", count: "49", children: [] },
              ],
            },
            {
              text: "Свыше 18 кВт (хаммам)",
              href: "#",
              count: "211",
              children: [
                {
                  text: "Harvia Cilindro",
                  href: "#",
                  count: "38",
                  children: [],
                },
                { text: "EOS Bi-O Tec", href: "#", count: "47", children: [] },
              ],
            },
          ],
        },
        {
          text: "Паротермальные печи для бани",
          href: "#",
          count: "74",
          children: [
            {
              text: "Конвекционные",
              href: "#",
              count: "38",
              children: [
                { text: "Helo Elegant", href: "#", count: "14", children: [] },
                { text: "Kastor Karhu", href: "#", count: "12", children: [] },
              ],
            },
            {
              text: "Паровые камни",
              href: "#",
              count: "36",
              children: [],
            },
          ],
        },
        {
          text: "Газо-дровяные печи для бани",
          href: "#",
          count: "31",
          children: [],
        },
        {
          text: "Каменные печи для бани",
          href: "#",
          count: "292",
          children: [
            {
              text: "Из природного камня",
              href: "#",
              count: "148",
              children: [
                { text: "Талькохлорит", href: "#", count: "64", children: [] },
                { text: "Серпентинит", href: "#", count: "52", children: [] },
                { text: "Дикий камень", href: "#", count: "32", children: [] },
              ],
            },
            {
              text: "Комбинированные",
              href: "#",
              count: "144",
              children: [],
            },
          ],
        },
        {
          text: "Печи для бани под обкладку кирпичом",
          href: "#",
          count: "15",
          children: [],
        },
        {
          text: "В облицовке талькохлорит",
          href: "#",
          count: "99",
          children: [],
        },
        {
          text: "С комбинированной облицовкой",
          href: "#",
          count: "19",
          children: [],
        },
      ],
      drovyanye: [
        {
          text: "Все дровяные печи",
          href: "#",
          count: "1166",
          children: [],
        },
        {
          text: "С закрытой каменкой",
          href: "#",
          count: "342",
          children: [
            {
              text: "Финские бренды",
              href: "#",
              count: "161",
              children: [
                {
                  text: "Harvia",
                  href: "#",
                  count: "84",
                  children: [
                    {
                      text: "Серия Pro",
                      href: "#",
                      count: "24",
                      children: [
                        {
                          text: "Harvia 20 Pro",
                          href: "#",
                          count: "8",
                          children: [],
                        },
                        {
                          text: "Harvia 22 Pro",
                          href: "#",
                          count: "9",
                          children: [],
                        },
                        {
                          text: "Harvia 36 Pro",
                          href: "#",
                          count: "7",
                          children: [],
                        },
                      ],
                    },
                    {
                      text: "Серия Premium",
                      href: "#",
                      count: "31",
                      children: [
                        {
                          text: "Harvia Kivi",
                          href: "#",
                          count: "14",
                          children: [],
                        },
                        {
                          text: "Harvia Nova",
                          href: "#",
                          count: "17",
                          children: [],
                        },
                      ],
                    },
                    {
                      text: "Серия Classic",
                      href: "#",
                      count: "29",
                      children: [
                        {
                          text: "Harvia M3SL",
                          href: "#",
                          count: "12",
                          children: [],
                        },
                        {
                          text: "Harvia 20SL",
                          href: "#",
                          count: "17",
                          children: [],
                        },
                      ],
                    },
                  ],
                },
                {
                  text: "Tulikivi",
                  href: "#",
                  count: "77",
                  children: [
                    {
                      text: "Massив талька",
                      href: "#",
                      count: "56",
                      children: [
                        {
                          text: "TU 1100",
                          href: "#",
                          count: "19",
                          children: [],
                        },
                        {
                          text: "TU 2200",
                          href: "#",
                          count: "21",
                          children: [],
                        },
                        { text: "Sumu", href: "#", count: "16", children: [] },
                      ],
                    },
                    {
                      text: "Облицованные",
                      href: "#",
                      count: "21",
                      children: [
                        { text: "Hiisi", href: "#", count: "10", children: [] },
                        { text: "Puu", href: "#", count: "11", children: [] },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              text: "Отечественные бренды",
              href: "#",
              count: "181",
              children: [
                {
                  text: "Везувий",
                  href: "#",
                  count: "88",
                  children: [
                    {
                      text: "Серия Легенда",
                      href: "#",
                      count: "42",
                      children: [
                        {
                          text: "Легенда 16",
                          href: "#",
                          count: "14",
                          children: [],
                        },
                        {
                          text: "Легенда 22",
                          href: "#",
                          count: "15",
                          children: [],
                        },
                        {
                          text: "Легенда ТО",
                          href: "#",
                          count: "13",
                          children: [],
                        },
                      ],
                    },
                    {
                      text: "Серия Скиф",
                      href: "#",
                      count: "46",
                      children: [
                        {
                          text: "Скиф 12",
                          href: "#",
                          count: "22",
                          children: [],
                        },
                        {
                          text: "Скиф ТО",
                          href: "#",
                          count: "24",
                          children: [],
                        },
                      ],
                    },
                  ],
                },
                {
                  text: "Теплодар",
                  href: "#",
                  count: "93",
                  children: [
                    {
                      text: "Сибирь",
                      href: "#",
                      count: "48",
                      children: [
                        {
                          text: "Сибирь 18",
                          href: "#",
                          count: "16",
                          children: [],
                        },
                        {
                          text: "Сибирь 24",
                          href: "#",
                          count: "18",
                          children: [],
                        },
                        {
                          text: "Сибирь 36",
                          href: "#",
                          count: "14",
                          children: [],
                        },
                      ],
                    },
                    {
                      text: "Уют",
                      href: "#",
                      count: "45",
                      children: [
                        {
                          text: "Уют-14",
                          href: "#",
                          count: "23",
                          children: [],
                        },
                        {
                          text: "Уют-18",
                          href: "#",
                          count: "22",
                          children: [],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          text: "С открытой каменкой",
          href: "#",
          count: "218",
          children: [
            {
              text: "Сетчатые",
              href: "#",
              count: "124",
              children: [
                {
                  text: "Костёр",
                  href: "#",
                  count: "56",
                  children: [
                    {
                      text: "До 14 м³",
                      href: "#",
                      count: "24",
                      children: [
                        {
                          text: "Костёр 14",
                          href: "#",
                          count: "12",
                          children: [],
                        },
                        {
                          text: "Мини 10",
                          href: "#",
                          count: "12",
                          children: [],
                        },
                      ],
                    },
                    {
                      text: "14–22 м³",
                      href: "#",
                      count: "20",
                      children: [
                        {
                          text: "Костёр 22",
                          href: "#",
                          count: "10",
                          children: [],
                        },
                        {
                          text: "Горячий 18",
                          href: "#",
                          count: "10",
                          children: [],
                        },
                      ],
                    },
                    {
                      text: "Свыше 22 м³",
                      href: "#",
                      count: "12",
                      children: [
                        {
                          text: "Костёр 40",
                          href: "#",
                          count: "7",
                          children: [],
                        },
                        {
                          text: "Mega 36",
                          href: "#",
                          count: "5",
                          children: [],
                        },
                      ],
                    },
                  ],
                },
                {
                  text: "Фёрингер",
                  href: "#",
                  count: "68",
                  children: [
                    {
                      text: "Ламели",
                      href: "#",
                      count: "36",
                      children: [
                        {
                          text: "ПФ 14 Ламели",
                          href: "#",
                          count: "18",
                          children: [],
                        },
                        {
                          text: "ПФ 22 Ламели",
                          href: "#",
                          count: "18",
                          children: [],
                        },
                      ],
                    },
                    {
                      text: "Конвекция",
                      href: "#",
                      count: "32",
                      children: [
                        {
                          text: "ПФ 14К",
                          href: "#",
                          count: "16",
                          children: [],
                        },
                        {
                          text: "ПФ 22К",
                          href: "#",
                          count: "16",
                          children: [],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              text: "Прямой нагрев",
              href: "#",
              count: "94",
              children: [
                {
                  text: "TMF",
                  href: "#",
                  count: "51",
                  children: [
                    {
                      text: "Гейзер",
                      href: "#",
                      count: "28",
                      children: [
                        {
                          text: "Гейзер 24 Inox",
                          href: "#",
                          count: "14",
                          children: [],
                        },
                        {
                          text: "Гейзер 30 Carbon",
                          href: "#",
                          count: "14",
                          children: [],
                        },
                      ],
                    },
                    {
                      text: "Калина",
                      href: "#",
                      count: "23",
                      children: [
                        {
                          text: "Калина Carbon",
                          href: "#",
                          count: "12",
                          children: [],
                        },
                        {
                          text: "Калина Inox",
                          href: "#",
                          count: "11",
                          children: [],
                        },
                      ],
                    },
                  ],
                },
                {
                  text: "Гефест",
                  href: "#",
                  count: "43",
                  children: [
                    {
                      text: "Серия ЗК",
                      href: "#",
                      count: "22",
                      children: [
                        { text: "ЗК 18", href: "#", count: "11", children: [] },
                        { text: "ЗК 24", href: "#", count: "11", children: [] },
                      ],
                    },
                    {
                      text: "Серия ПБ",
                      href: "#",
                      count: "21",
                      children: [
                        { text: "ПБ 03", href: "#", count: "10", children: [] },
                        { text: "ПБ 04", href: "#", count: "11", children: [] },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          text: "Чугунные печи",
          href: "#",
          count: "95",
          children: [
            {
              text: "Отечественные",
              href: "#",
              count: "60",
              children: [
                {
                  text: "Гефест ПЧ",
                  href: "#",
                  count: "34",
                  children: [
                    {
                      text: "Стандарт",
                      href: "#",
                      count: "18",
                      children: [
                        { text: "ПЧ 3П", href: "#", count: "9", children: [] },
                        { text: "ПЧ 5П", href: "#", count: "9", children: [] },
                      ],
                    },
                    {
                      text: "Большие",
                      href: "#",
                      count: "16",
                      children: [
                        { text: "ПЧ 7П", href: "#", count: "8", children: [] },
                        { text: "ПЧ 10П", href: "#", count: "8", children: [] },
                      ],
                    },
                  ],
                },
                {
                  text: "Эверест",
                  href: "#",
                  count: "26",
                  children: [
                    {
                      text: "Стандарт",
                      href: "#",
                      count: "14",
                      children: [
                        {
                          text: "Эверест-10",
                          href: "#",
                          count: "7",
                          children: [],
                        },
                        {
                          text: "Эверест-18",
                          href: "#",
                          count: "7",
                          children: [],
                        },
                      ],
                    },
                    {
                      text: "Премиум",
                      href: "#",
                      count: "12",
                      children: [
                        {
                          text: "Эверест Elite",
                          href: "#",
                          count: "6",
                          children: [],
                        },
                        {
                          text: "Эверест Lux",
                          href: "#",
                          count: "6",
                          children: [],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              text: "Финские",
              href: "#",
              count: "35",
              children: [
                {
                  text: "Harvia Legend",
                  href: "#",
                  count: "20",
                  children: [
                    {
                      text: "Серия 200",
                      href: "#",
                      count: "10",
                      children: [
                        {
                          text: "Legend 240",
                          href: "#",
                          count: "5",
                          children: [],
                        },
                        {
                          text: "Legend 280",
                          href: "#",
                          count: "5",
                          children: [],
                        },
                      ],
                    },
                    {
                      text: "Серия 300",
                      href: "#",
                      count: "10",
                      children: [
                        {
                          text: "Legend 360",
                          href: "#",
                          count: "5",
                          children: [],
                        },
                        {
                          text: "Legend 400D",
                          href: "#",
                          count: "5",
                          children: [],
                        },
                      ],
                    },
                  ],
                },
                {
                  text: "IKI Original",
                  href: "#",
                  count: "15",
                  children: [
                    {
                      text: "IKI Mini",
                      href: "#",
                      count: "8",
                      children: [
                        {
                          text: "IKI Mini 6",
                          href: "#",
                          count: "4",
                          children: [],
                        },
                        {
                          text: "IKI Mini 8",
                          href: "#",
                          count: "4",
                          children: [],
                        },
                      ],
                    },
                    {
                      text: "IKI Maxi",
                      href: "#",
                      count: "7",
                      children: [
                        {
                          text: "IKI Maxi 14",
                          href: "#",
                          count: "3",
                          children: [],
                        },
                        {
                          text: "IKI Maxi 18",
                          href: "#",
                          count: "4",
                          children: [],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          text: "Печи с баком для воды",
          href: "#",
          count: "127",
          children: [
            {
              text: "Боковой бак",
              href: "#",
              count: "74",
              children: [
                {
                  text: "50 л",
                  href: "#",
                  count: "28",
                  children: [
                    {
                      text: "Нержавеющие",
                      href: "#",
                      count: "15",
                      children: [
                        {
                          text: "Harvia + бак 50 л",
                          href: "#",
                          count: "8",
                          children: [],
                        },
                        {
                          text: "Везувий + бак 50 л",
                          href: "#",
                          count: "7",
                          children: [],
                        },
                      ],
                    },
                    {
                      text: "Эмалированные",
                      href: "#",
                      count: "13",
                      children: [
                        {
                          text: "Теплодар + бак 50",
                          href: "#",
                          count: "7",
                          children: [],
                        },
                        {
                          text: "TMF + бак 50",
                          href: "#",
                          count: "6",
                          children: [],
                        },
                      ],
                    },
                  ],
                },
                {
                  text: "70 л",
                  href: "#",
                  count: "31",
                  children: [
                    {
                      text: "Нержавеющие",
                      href: "#",
                      count: "18",
                      children: [
                        {
                          text: "Костёр + бак 70 л",
                          href: "#",
                          count: "9",
                          children: [],
                        },
                        {
                          text: "Фёрингер + бак 70 л",
                          href: "#",
                          count: "9",
                          children: [],
                        },
                      ],
                    },
                    {
                      text: "Чугунные",
                      href: "#",
                      count: "13",
                      children: [
                        {
                          text: "Гефест + бак 70 л",
                          href: "#",
                          count: "7",
                          children: [],
                        },
                        {
                          text: "Эверест + бак 70 л",
                          href: "#",
                          count: "6",
                          children: [],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              text: "Навесной бак",
              href: "#",
              count: "53",
              children: [
                {
                  text: "30 л",
                  href: "#",
                  count: "20",
                  children: [
                    {
                      text: "Нержавеющие",
                      href: "#",
                      count: "12",
                      children: [
                        {
                          text: "Harvia WL300",
                          href: "#",
                          count: "6",
                          children: [],
                        },
                        {
                          text: "Helo WL30",
                          href: "#",
                          count: "6",
                          children: [],
                        },
                      ],
                    },
                    {
                      text: "Оцинкованные",
                      href: "#",
                      count: "8",
                      children: [
                        {
                          text: "Везувий НВ30",
                          href: "#",
                          count: "8",
                          children: [],
                        },
                      ],
                    },
                  ],
                },
                {
                  text: "50 л",
                  href: "#",
                  count: "33",
                  children: [
                    {
                      text: "Нержавеющие",
                      href: "#",
                      count: "20",
                      children: [
                        {
                          text: "Harvia WL500",
                          href: "#",
                          count: "10",
                          children: [],
                        },
                        {
                          text: "Helo WL50",
                          href: "#",
                          count: "10",
                          children: [],
                        },
                      ],
                    },
                    {
                      text: "Оцинкованные",
                      href: "#",
                      count: "13",
                      children: [
                        {
                          text: "Везувий НВ50",
                          href: "#",
                          count: "7",
                          children: [],
                        },
                        {
                          text: "Теплодар НВ50",
                          href: "#",
                          count: "6",
                          children: [],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };
  }

  function parseServicesData() {
    const modal = document.getElementById("catalog-modal");
    if (!modal) return [];
    const pechiPanel = modal.querySelector(
      '.catalog-modal__panel[data-panel="pechi"]',
    );
    if (!pechiPanel) return [];
    const services = [];
    const columns = pechiPanel.querySelectorAll(".catalog-modal__column");
    columns.forEach((col) => {
      const title = col.querySelector(".catalog-modal__column-title");
      if (title && title.textContent.trim().toUpperCase().includes("УСЛУГИ")) {
        col
          .querySelectorAll(".catalog-modal__subcategory-link")
          .forEach((link) => {
            services.push({
              text: link.textContent.trim(),
              href: link.getAttribute("href") || "#",
            });
          });
      }
    });
    return services;
  }

  // ── Построение root-страницы ────────────────────────
  function buildRootPage() {
    const page = createPage(null, null);
    const list = document.createElement("ul");
    list.className = "mcm__list";
    catalogData.forEach((cat) => {
      list.appendChild(createCategoryItem(cat));
    });
    page.appendChild(list);
    page.classList.add("mcm__page--active");
    catalogPages.appendChild(page);
    pageStack = [page];
    buildServicesTab();
  }

  function createPage(title, backCallback) {
    const page = document.createElement("div");
    page.className = "mcm__page";

    if (backCallback) {
      const backBtn = document.createElement("button");
      backBtn.className = "mcm__back";
      backBtn.type = "button";
      backBtn.innerHTML = `<img src="./!FILES/NEW-HTML/assets/icons/arrow/chevron-right.svg" alt="" class="mcm__back-icon" /> Назад`;
      backBtn.addEventListener("click", backCallback);
      page.appendChild(backBtn);
    }

    if (title) {
      const h3 = document.createElement("h3");
      h3.className = "mcm__page-title";
      h3.textContent = title;
      page.appendChild(h3);
    }

    return page;
  }

  function createCategoryItem(cat) {
    const li = document.createElement("li");
    li.className = "mcm__list-item";

    const hasChildren = cat.subcategories && cat.subcategories.length > 0;
    const link = document.createElement(hasChildren ? "button" : "a");
    link.className =
      "mcm__list-link" + (cat.isAccent ? " mcm__list-link--accent" : "");

    if (!hasChildren) {
      link.href = cat.href || "#";
    } else {
      link.type = "button";
    }

    if (cat.icon) {
      const icon = document.createElement("img");
      icon.className = "mcm__list-icon";
      icon.src = cat.icon;
      icon.alt = "";
      icon.width = 36;
      icon.height = 36;
      link.appendChild(icon);
    }

    const textSpan = document.createElement("span");
    textSpan.className = "mcm__list-text";
    textSpan.textContent = cat.text;
    link.appendChild(textSpan);

    // if (cat.count) {
    //   const countSpan = document.createElement("span");
    //   countSpan.className = "mcm__list-count";
    //   countSpan.textContent = cat.count;
    //   link.appendChild(countSpan);
    // }

    if (hasChildren) {
      const chevron = document.createElement("img");
      chevron.className = "mcm__list-chevron";
      chevron.src = "./!FILES/NEW-HTML/assets/icons/arrow/chevron-right.svg";
      chevron.alt = "";
      chevron.width = 14;
      chevron.height = 14;
      link.appendChild(chevron);

      link.addEventListener("click", () => {
        drillDown(cat.text, cat.subcategories);
      });
    }

    li.appendChild(link);
    return li;
  }

  // ── Drill-down ───────────────────────────────────────
  function drillDown(title, items) {
    const currentPage = pageStack[pageStack.length - 1];
    const newPage = createPage(title, () => drillUp());
    const list = document.createElement("ul");
    list.className = "mcm__list";

    items.forEach((item) => {
      list.appendChild(
        createCategoryItem({
          text: item.text,
          href: item.href,
          count: item.count,
          icon: null,
          isAccent: false,
          subcategories: item.children || [],
        }),
      );
    });

    newPage.appendChild(list);
    newPage.classList.add("mcm__page--enter-right");
    catalogPages.appendChild(newPage);

    void newPage.offsetWidth; // force reflow

    currentPage.classList.remove("mcm__page--active");
    currentPage.classList.add("mcm__page--exit-left");
    newPage.classList.remove("mcm__page--enter-right");
    newPage.classList.add("mcm__page--active");

    pageStack.push(newPage);
  }

  function drillUp() {
    if (pageStack.length <= 1) return;
    const currentPage = pageStack.pop();
    const prevPage = pageStack[pageStack.length - 1];

    currentPage.classList.remove("mcm__page--active");
    currentPage.classList.add("mcm__page--enter-right");
    prevPage.classList.remove("mcm__page--exit-left");
    prevPage.classList.add("mcm__page--active");

    currentPage.addEventListener("transitionend", () => currentPage.remove(), {
      once: true,
    });
  }

  function resetDrillDown() {
    while (pageStack.length > 1) {
      pageStack.pop().remove();
    }
    if (pageStack[0]) {
      pageStack[0].className = "mcm__page mcm__page--active";
    }
  }

  // ── Услуги ──────────────────────────────────────────
  function buildServicesTab() {
    const servicesPanel = menu.querySelector(
      '.mcm__tab-panel[data-panel="services"]',
    );
    if (!servicesPanel) return;
    const list = document.createElement("ul");
    list.className = "mcm__services-list";
    servicesData.forEach((item) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.className = "mcm__service-link";
      a.href = item.href;
      a.textContent = item.text;
      li.appendChild(a);
      list.appendChild(li);
    });
    servicesPanel.appendChild(list);
  }

  // ── Контакты ────────────────────────────────────────
  function cloneContacts() {
    if (!contactsContainer) return;
    const source = document.querySelector(".mobile-menu__contacts");
    if (!source) return;
    contactsContainer.appendChild(source.cloneNode(true));
  }
}
