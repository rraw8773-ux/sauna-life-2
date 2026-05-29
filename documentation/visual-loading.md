# Guidelines for Pre-Initialization Visual Optimization (Skeletons & Shimmer)

This document establishes the unified technical and visual design system guidelines for optimizing page load states on the website. The primary goal is to prevent **Layout Shift (CLS)** and visual "broken page" glitches before JavaScript components (like sliders, tags, and dynamic filters) have finished loading and initializing.

---

## 💎 Core Principles

1. **CSS-First Layout Constraints**:
   Before JS runs, the page layout must be restricted to its final, loaded dimensions using pure CSS and `:not(.is-initialized)` or `:not(.slick-initialized)` selectors. 
2. **Double-Safe Hiding**:
   Extra wrapping elements, slides, or vertical list overflows must be immediately hidden in CSS on page load.
3. **Premium Shimmer Loading (Skeleton)**:
   Any element undergoing dynamic JS calculations must display a smooth, sliding translucent white shimmer gradient over a light background, indicating a premium interactive setup state.
4. **Clean JS Transition Tagging**:
   The moment the JS component completes calculation, layout placement, or initial setup, it must apply an initialization class (e.g., `is-initialized` or standard `slick-initialized`) to instantly hide the skeleton state and activate full interactivity.

---

## 🎨 Unified Design Tokens for Shimmer Animations

To keep the skeleton effects identical across the site, we use the following standard parameters:

- **Shimmer Background Gradient**: 
  `linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.4) 50%, rgba(255, 255, 255, 0) 100%)`
- **Opacity Level**: `0.8` to `0.85`
- **Timing & Speed**: `1.8s` linear or ease-in-out, running infinitely.
- **Direction**: Horizontal sweep from `translateX(-100%)` to `translateX(100%)`.
- **Clipping & Safety**: `overflow: hidden` on the target skeleton wrapper is mandatory to prevent shimmer leakage.

---

## 🛠 Reference Patterns & Implementations

### 1. Sliders & Galleries (e.g., Product Card Slider)

When multiple gallery images default to block layout and stack vertically before the Slick slider initializes.

* **CSS Pattern (`product-card.css`)**:
  ```css
  /* Hiding extra slides before Slick initials */
  .product-card__slider:not(.slick-initialized) .product-card__slide:not(:first-child) {
    display: none !important;
  }

  /* Shimmer on the primary frame container */
  .product-card__slider:not(.slick-initialized) .product-card__image-frame {
    position: relative;
    overflow: hidden;
    aspect-ratio: 1 / 1;
    background-color: var(--color-light);
  }

  .product-card__slider:not(.slick-initialized) .product-card__image-frame::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.3) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    animation: product-card-shimmer 1.8s infinite linear;
    transform: translateX(-100%);
  }

  @keyframes product-card-shimmer {
    100% {
      transform: translateX(100%);
    }
  }
  ```
* **JS Pattern**: 
  No extra JS is needed because Slick Slider automatically appends the `.slick-initialized` class to the wrapper when setup completes.

---

### 2. Collapsible Dynamic Filter Lists

When a group has a `data-visible` limit, and shows all 20+ elements before the script hides them.

* **CSS Pattern (`forms.css`)**:
  ```css
  /* Hiding category list items from index 4 onwards, keeping the last element (the more button) visible */
  .filters__group[data-visible="3"]:not(.is-initialized) .filters__category-item:nth-last-child(n+2):nth-child(n+4) {
    display: none !important;
  }

  /* Hiding brand checkboxes from index 5 onwards */
  .filters__group[data-visible="4"]:not(.is-initialized) .filters__checkbox-list .checkbox:nth-child(n+5) {
    display: none !important;
  }

  /* Group shimmer */
  .filters__group[data-visible]:not(.is-initialized) {
    position: relative;
    opacity: 0.8;
    pointer-events: none;
    overflow: hidden;
  }

  .filters__group[data-visible]:not(.is-initialized)::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.4) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    animation: filters-shimmer 1.8s infinite ease-in-out;
    transform: translateX(-100%);
    pointer-events: none;
  }

  @keyframes filters-shimmer {
    100% {
      transform: translateX(100%);
    }
  }
  ```
* **JS Pattern (`filters-more.js`)**:
  ```javascript
  export function initFiltersMore() {
    document.querySelectorAll(".filters__more").forEach((btn) => {
      const group = btn.closest(".filters__group");
      if (!group) return;
      
      // ... collapse logic setup ...

      // SIGNAL JS COMPLETE
      group.classList.add("is-initialized");
    });
  }
  ```

---

### 3. Dynamic Inline Elements / Line-Wrapping Clips (e.g., Tags List)

When inline elements (like categories and brands tags) wrap into multiple lines before JS measures heights and collapses them into a single line.

* **CSS Pattern (`tags.css`)**:
  ```css
  /* Shimmer state */
  .tags:not(.is-initialized) {
    position: relative;
    opacity: 0.85;
    pointer-events: none;
  }

  /* Desktop layout clamp */
  @media (min-width: 768px) {
    .tags:not(.is-initialized) {
      overflow: hidden;
      max-height: 42px; /* Perfect height of a single tag row */
    }

    /* Keep page light by instantly hiding index 9 onwards */
    .tags:not(.is-initialized) .tags__list .tags__item:nth-child(n+9) {
      display: none !important;
    }
  }

  .tags:not(.is-initialized)::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.4) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    animation: tags-shimmer 1.8s infinite ease-in-out;
    transform: translateX(-100%);
    pointer-events: none;
  }

  @keyframes tags-shimmer {
    100% {
      transform: translateX(100%);
    }
  }
  ```
* **JS Pattern (`tags.js`)**:
  ```javascript
  function updateTagsVisibility() {
    // ... calculate layout offsetTop and assign tags__item--hidden ...

    // SIGNAL JS READY ON CONTAINER
    const parentTags = list.closest(".tags");
    if (parentTags) {
      parentTags.classList.add("is-initialized");
    }
  }
  ```

---

## 📈 Quality Checklist for Future Integrations

- [ ] Does the element have a `:not(.is-initialized)` or `:not(.slick-initialized)` selector block?
- [ ] Does the skeleton wrapper have `overflow: hidden` to clip the white shimmer sweep?
- [ ] Are elements that overflow vertically/horizontally hidden instantly via CSS overrides?
- [ ] Does the JS script successfully append the `.is-initialized` class to the wrapper parent?
- [ ] Does the skeletal height accurately match the initialized height, ensuring **0px of Layout Shift**?
