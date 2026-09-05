# Nekachalka Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static, responsive two-page demo site (`index.html` + `pricing.html`) that replaces the Taplink page https://taplink.cc/nekachalka with a modern, light "premium wellness" design, while keeping every booking/payment/contact action pointed at the same real external services (no fake backend).

**Architecture:** Plain HTML/CSS/JS, no build step, no package.json. One shared stylesheet (`css/style.css`) and one small script (`js/script.js`) for the pricing tabs, used by both pages. All copy, prices, and links come from the source analysis in `source/` and the spec — nothing invented.

**Tech Stack:** HTML5, CSS3 (custom properties, flexbox/grid, mobile-first media queries), vanilla JS (ES2017+, no framework), Google Fonts (Anton + Manrope) via `<link>`.

**Spec:** `docs/superpowers/specs/2026-09-05-nekachalka-redesign-design.md`

## Global Constraints

- No build tools, bundlers, or npm dependencies in this repo — plain files only, matching `raketa4.github.io` and `Alina_web`.
- Mobile-first responsive: must render correctly from ~375px wide up through desktop ≥1200px (explicit user requirement).
- Every external link (Telegram, WhatsApp, Max, phone, MobiFitness schedule, Taplink shop checkout, Yandex Maps reviews, Google Docs contract) must be a real, working URL from the spec's link table — never a placeholder `#`.
- Design tokens (colors, fonts, spacing) are defined once in Task 1 as CSS custom properties on `:root`; later tasks consume them by name, never hardcode a competing hex value.
- Colors: background `#F7F4EF`, background-alt `#EFE8DB`, text `#2A2724`, muted text `#7A7168`, accent `#C1663C`, accent-dark (hover) `#A6512E`, dark block `#2A2724`, dark-alt block `#363029`, on-dark text `#F7F4EF`.
- Fonts: display/headings = `Anton`, body = `Manrope`, both loaded from Google Fonts.
- File layout: `index.html`, `pricing.html`, `css/style.css`, `js/script.js`, `assets/img/`.
- No test framework is added to this repo (that would contradict the no-dependencies constraint). Verification instead uses: (a) the `webapp-testing` skill (Playwright) driven against a local static server (`python -m http.server 8000` from the project root — Python is already available, no install needed) to check rendered content/links/layout, and (b) a small stdlib-only Python link-audit script in the final task. Every task still follows write → verify fail → implement → verify pass → commit.

---

## File Structure

- `index.html` — the main landing page (all sections except the full price list)
- `pricing.html` — the full 24-item price list, sharing header/footer markup and the same stylesheet
- `css/style.css` — single stylesheet: tokens/reset (Task 1), then one clearly commented block per section added by later tasks, responsive media queries appended at the very end (Task 8)
- `js/script.js` — vanilla JS for the pricing-page category tabs (Task 6)
- `assets/img/` — `before-after-1.jpg`, `before-after-2.jpg` (copied from `source/images/`), `logo.png` (favicon/OG image, copied from `source/images/img4_60782114.png`)

---

### Task 1: Project scaffold, design tokens, base styles, HTML skeletons

**Files:**
- Create: `assets/img/logo.png` (copy of `source/images/img4_60782114.png`, used as favicon and later as the OG share image)
- Create: `css/style.css`
- Create: `index.html`
- Create: `pricing.html`

**Interfaces:**
- Produces CSS custom properties (consumed by every later CSS task): `--color-bg`, `--color-bg-alt`, `--color-text`, `--color-text-muted`, `--color-accent`, `--color-accent-dark`, `--color-dark`, `--color-dark-alt`, `--color-on-dark`, `--font-display`, `--font-body`, `--radius-lg` (24px), `--radius-md` (16px), `--shadow-soft`, `--container-width` (1140px).
- Produces utility classes (consumed by every later HTML task): `.container`, `.section`, `.section--alt`, `.section--dark`, `.btn`, `.btn-primary`, `.btn-outline`, `.eyebrow` (small uppercase kicker text), `.visually-hidden`.
- Produces the shared header markup (logo wordmark + top nav linking `index.html` / `pricing.html`) and shared footer skeleton (filled in with real content in Task 7), included verbatim in both HTML files.

- [ ] **Step 1: Copy the logo image so the favicon reference in Step 2/3 doesn't 404**

```bash
mkdir -p assets/img
cp source/images/img4_60782114.png assets/img/logo.png
```

- [ ] **Step 2: Write `css/style.css` with tokens, reset, and utilities**

```css
/* === TOKENS === */
:root {
  --color-bg: #F7F4EF;
  --color-bg-alt: #EFE8DB;
  --color-text: #2A2724;
  --color-text-muted: #7A7168;
  --color-accent: #C1663C;
  --color-accent-dark: #A6512E;
  --color-dark: #2A2724;
  --color-dark-alt: #363029;
  --color-on-dark: #F7F4EF;
  --font-display: 'Anton', sans-serif;
  --font-body: 'Manrope', sans-serif;
  --radius-lg: 24px;
  --radius-md: 16px;
  --shadow-soft: 0 12px 32px rgba(42, 39, 36, 0.10);
  --container-width: 1140px;
}

/* === RESET === */
*, *::before, *::after { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body {
  margin: 0;
  font-family: var(--font-body);
  background: var(--color-bg);
  color: var(--color-text);
  line-height: 1.55;
  font-size: 16px;
}
img { max-width: 100%; display: block; }
a { color: inherit; }
h1, h2, h3 { font-family: var(--font-display); text-transform: uppercase; letter-spacing: 0.01em; margin: 0 0 16px; line-height: 1.1; }
p { margin: 0 0 16px; }
ul { margin: 0; padding: 0; list-style: none; }

/* === LAYOUT UTILITIES === */
.container {
  width: 100%;
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 0 24px;
}
.section { padding: 56px 0; }
.section--alt { background: var(--color-bg-alt); }
.section--dark { background: var(--color-dark); color: var(--color-on-dark); }
.section--dark h1, .section--dark h2, .section--dark h3 { color: var(--color-on-dark); }

.eyebrow {
  display: inline-block;
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 0.75rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--color-accent);
  margin-bottom: 12px;
}

.visually-hidden {
  position: absolute; width: 1px; height: 1px;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap;
}

/* === BUTTONS === */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 28px;
  border-radius: 999px;
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 0.95rem;
  text-decoration: none;
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform 0.15s ease, background-color 0.15s ease, color 0.15s ease;
}
.btn-primary { background: var(--color-accent); color: var(--color-on-dark); }
.btn-primary:hover { background: var(--color-accent-dark); transform: translateY(-2px); }
.btn-outline { background: transparent; border-color: currentColor; color: inherit; }
.btn-outline:hover { background: var(--color-text); border-color: var(--color-text); color: var(--color-on-dark); }
.section--dark .btn-outline:hover { background: var(--color-on-dark); border-color: var(--color-on-dark); color: var(--color-dark); }

/* === SITE HEADER === */
.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;
}
.site-header .logo-mark {
  font-family: var(--font-display);
  font-size: 1.5rem;
  letter-spacing: 0.03em;
  text-decoration: none;
  color: inherit;
}
.site-header nav ul { display: flex; gap: 24px; }
.site-header nav a { text-decoration: none; font-weight: 700; font-size: 0.9rem; }
```

- [ ] **Step 3: Write `index.html` skeleton with shared head/header**

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Некачалка — фитнес-пространство в Санкт-Петербурге</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Anton&family=Manrope:wght@400;500;700;800&display=swap" rel="stylesheet">
  <link rel="icon" href="assets/img/logo.png">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div class="container">
    <header class="site-header">
      <a href="index.html" class="logo-mark">НЕКАЧАЛКА</a>
      <nav>
        <ul>
          <li><a href="index.html">Главная</a></li>
          <li><a href="pricing.html">Цены</a></li>
        </ul>
      </nav>
    </header>
  </div>

  <!-- Sections added in Tasks 2-7 go here -->

  <footer class="site-footer section section--dark">
    <div class="container">
      <!-- Filled in Task 7 -->
    </div>
  </footer>
</body>
</html>
```

- [ ] **Step 4: Write `pricing.html` skeleton reusing the same head/header/footer**

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Цены — Некачалка</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Anton&family=Manrope:wght@400;500;700;800&display=swap" rel="stylesheet">
  <link rel="icon" href="assets/img/logo.png">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div class="container">
    <header class="site-header">
      <a href="index.html" class="logo-mark">НЕКАЧАЛКА</a>
      <nav>
        <ul>
          <li><a href="index.html">Главная</a></li>
          <li><a href="pricing.html">Цены</a></li>
        </ul>
      </nav>
    </header>
  </div>

  <!-- Pricing content added in Task 5 -->

  <footer class="site-footer section section--dark">
    <div class="container">
      <!-- Filled in Task 7 (copied verbatim from index.html) -->
    </div>
  </footer>

  <script src="js/script.js"></script>
</body>
</html>
```

- [ ] **Step 5: Verify the scaffold renders**

Run: `python -m http.server 8000` from the project root, then use the `webapp-testing` skill to open `http://localhost:8000/index.html` and `http://localhost:8000/pricing.html`.
Expected: both pages load with no console errors, cream background (`#F7F4EF`), visible "НЕКАЧАЛКА" wordmark top-left in the Anton font, a working nav link between the two pages, and no 404 for the favicon.

- [ ] **Step 6: Commit**

```bash
git add assets/img/logo.png css/style.css index.html pricing.html
git commit -m "Scaffold project: design tokens, base styles, page skeletons"
```

---

### Task 2: Hero section

**Files:**
- Modify: `index.html` (insert after the header, before the footer comment)
- Modify: `css/style.css` (append new block)

**Interfaces:**
- Consumes: `.section--dark`, `.btn`, `.btn-primary`, `.btn-outline`, `.eyebrow`, `.container` from Task 1.
- Produces: `.hero`, `.hero__tags`, `.hero__actions` classes, reused nowhere else but documented here so Task 8 knows what to target for responsive layout.

- [ ] **Step 1: Add the hero markup to `index.html`**

```html
<section class="hero section section--dark">
  <div class="container">
    <p class="eyebrow">Фитнес пространство</p>
    <h1>Пространство твоих достижений</h1>
    <p>Прокачиваем тело и сознание</p>
    <ul class="hero__tags">
      <li>Фитнес</li>
      <li>Танцы</li>
      <li>Растяжка</li>
      <li>Пилатес</li>
      <li>Бокс</li>
    </ul>
    <p>Персональные тренировки. Групповые занятия до 10 человек.</p>
    <p><strong>Пробная тренировка — от 600 рублей</strong></p>
    <div class="hero__actions">
      <a class="btn btn-primary" href="https://t.me/nekachalka?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%21%20%D0%A0%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D0%B6%D0%B8%D1%82%D0%B5%2C%20%D0%BA%D0%B0%D0%BA%20%D0%BF%D0%BE%D0%BB%D1%83%D1%87%D0%B8%D1%82%D1%8C%20%D0%BF%D1%80%D0%BE%D0%B1%D0%BD%D0%BE%D0%B5%20%D0%B7%D0%B0%D0%BD%D1%8F%D1%82%D0%B8%D0%B5%20%D0%B2%20%D0%BF%D0%BE%D0%B4%D0%B0%D1%80%D0%BE%D0%BA%3F">Хочу пробное занятие в подарок</a>
      <a class="btn btn-outline" href="https://wa.me/79992161077?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%21%20%D0%A0%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D0%B6%D0%B8%D1%82%D0%B5%2C%20%D0%BA%D0%B0%D0%BA%20%D0%BF%D0%BE%D0%BB%D1%83%D1%87%D0%B8%D1%82%D1%8C%20%D0%BF%D1%80%D0%BE%D0%B1%D0%BD%D0%BE%D0%B5%20%D0%B7%D0%B0%D0%BD%D1%8F%D1%82%D0%B8%D0%B5%20%D0%B2%20%D0%BF%D0%BE%D0%B4%D0%B0%D1%80%D0%BE%D0%BA%3F">Написать в WhatsApp</a>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add hero styles to `css/style.css`**

```css
/* === HERO === */
.hero { padding: 72px 0 64px; }
.hero h1 { font-size: clamp(2.2rem, 6vw, 3.5rem); max-width: 14ch; }
.hero__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
  margin: 20px 0;
}
.hero__tags li {
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 6px 14px;
  border: 1px solid rgba(247, 244, 239, 0.35);
  border-radius: 999px;
}
.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 28px;
}
```

- [ ] **Step 3: Verify**

Run: with the local server still running, use the `webapp-testing` skill to reload `http://localhost:8000/index.html`.
Expected: dark hero block at the top with the heading "Пространство твоих достижений", five service tags in a row (wrapping on narrow widths), and two visible buttons whose `href` attributes start with `https://t.me/nekachalka?text=` and `https://wa.me/79992161077?text=` respectively — confirm by inspecting the rendered DOM, not just visually.

- [ ] **Step 4: Commit**

```bash
git add index.html css/style.css
git commit -m "Add hero section with real Telegram/WhatsApp CTA links"
```

---

### Task 3: About + Services sections

**Files:**
- Modify: `index.html` (insert after hero)
- Modify: `css/style.css` (append)

**Interfaces:**
- Consumes: `.section`, `.section--alt`, `.container`, `.btn`, `.btn-outline`, `.eyebrow` from Task 1.
- Produces: `.about`, `.services`, `.service-card` classes.

- [ ] **Step 1: Add About markup**

```html
<section class="about section">
  <div class="container">
    <p class="eyebrow">О пространстве</p>
    <h2>Почему «Некачалка»?</h2>
    <p>Потому что мы не просто тренажёрный зал. Мы большая спортивная семья, которая продолжает расти. С первых занятий вы почувствуете себя на своём месте и на одной волне со всеми.</p>
    <p>Запишитесь на пробную тренировку и получите её в подарок при покупке абонемента в день занятия.</p>
    <p>Силовые тренировки, танцы, растяжка, йога или бокс — выбирай, что по душе, и занимайся персонально или в мини-группе!</p>
  </div>
</section>
```

- [ ] **Step 2: Add Services markup**

```html
<section class="services section section--alt">
  <div class="container">
    <p class="eyebrow">Услуги</p>
    <h2>Подбери свой вариант тренировок</h2>
    <div class="services__grid">
      <article class="service-card">
        <h3>Персональные тренировки</h3>
        <p>Индивидуальная программа один на один с тренером.</p>
        <p><strong>от 1000 ₽</strong></p>
        <a class="btn btn-outline" href="pricing.html#personal">Смотреть тарифы</a>
      </article>
      <article class="service-card">
        <h3>Групповые тренировки</h3>
        <p>Мини-группы до 10 человек: фитнес, танцы, растяжка, пилатес, бокс.</p>
        <p><strong>от 600 ₽</strong></p>
        <a class="btn btn-outline" href="pricing.html#group">Смотреть тарифы</a>
      </article>
      <article class="service-card">
        <h3>Сплит-тренировки</h3>
        <p>Формат на двоих — делите тренировку и стоимость с партнёром.</p>
        <p><strong>от 1300 ₽</strong></p>
        <a class="btn btn-outline" href="pricing.html#split">Смотреть тарифы</a>
      </article>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Add styles**

```css
/* === ABOUT === */
.about .container { max-width: 760px; }

/* === SERVICES === */
.services__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin-top: 32px;
}
.service-card {
  background: var(--color-bg);
  border-radius: var(--radius-lg);
  padding: 32px;
  box-shadow: var(--shadow-soft);
}
.service-card h3 { font-size: 1.3rem; }
```

- [ ] **Step 4: Verify**

Use the `webapp-testing` skill to reload `http://localhost:8000/index.html`.
Expected: About paragraph text renders exactly as written above; three service cards stack vertically (single column, since desktop grid columns are added in Task 8) each with a heading, price, and a "Смотреть тарифы" button whose `href` is `pricing.html#personal`, `pricing.html#group`, or `pricing.html#split` respectively.

- [ ] **Step 5: Commit**

```bash
git add index.html css/style.css
git commit -m "Add About and Services sections"
```

---

### Task 4: Before/After gallery

**Files:**
- Create: `assets/img/before-after-1.jpg` (copy of `source/images/img1_60928781.jpg`)
- Create: `assets/img/before-after-2.jpg` (copy of `source/images/img6_60923616.jpg`)
- Modify: `index.html` (insert after Services)
- Modify: `css/style.css` (append)

**Interfaces:**
- Consumes: `.section`, `.container`, `.eyebrow` from Task 1.
- Produces: `.gallery`, `.gallery__grid`, `.gallery__item` classes.

- [ ] **Step 1: Copy the two real client photos into the project**

```bash
mkdir -p assets/img
cp source/images/img1_60928781.jpg assets/img/before-after-1.jpg
cp source/images/img6_60923616.jpg assets/img/before-after-2.jpg
```

- [ ] **Step 2: Add gallery markup**

```html
<section class="gallery section">
  <div class="container">
    <p class="eyebrow">Результаты</p>
    <h2>До / После</h2>
    <div class="gallery__grid">
      <figure class="gallery__item">
        <img src="assets/img/before-after-1.jpg" alt="Клиентка Некачалки: результат с ноября 2020 по март 2022" loading="lazy">
        <figcaption>Ноябрь 2020 → Март 2022</figcaption>
      </figure>
      <figure class="gallery__item">
        <img src="assets/img/before-after-2.jpg" alt="Клиентка Некачалки: результат с июля 2021 по август 2022" loading="lazy">
        <figcaption>Июль 2021 → Август 2022</figcaption>
      </figure>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Add styles**

```css
/* === GALLERY === */
.gallery__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin-top: 32px;
}
.gallery__item {
  margin: 0;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-soft);
}
.gallery__item img { width: 100%; height: auto; }
.gallery__item figcaption {
  padding: 16px 20px;
  background: var(--color-bg);
  font-weight: 700;
  font-size: 0.9rem;
}
```

- [ ] **Step 4: Verify**

Use the `webapp-testing` skill to reload `http://localhost:8000/index.html`.
Expected: two images load successfully (no broken-image icon), each with a visible caption; check the network/console log shows no 404 for `assets/img/before-after-1.jpg` or `-2.jpg`.

- [ ] **Step 5: Commit**

```bash
git add assets/img/before-after-1.jpg assets/img/before-after-2.jpg index.html css/style.css
git commit -m "Add Before/After gallery with real client photos"
```

---

### Task 5: Pricing preview (index.html) + full pricing.html markup

**Files:**
- Modify: `index.html` (insert after gallery)
- Modify: `pricing.html` (replace the "Pricing content added in Task 5" comment)
- Modify: `css/style.css` (append)

**Interfaces:**
- Consumes: `.section`, `.section--alt`, `.container`, `.btn`, `.btn-primary`, `.eyebrow` from Task 1.
- Produces: `.pricing-preview` (index.html only); `.price-tabs`, `.price-tab` (button, `data-target` attribute), `.price-panel` (`id` matching `data-target`, `.is-active` state class), `.price-list`, `.price-row` (`pricing.html` only). Task 6 (JS) consumes `.price-tab`, `.price-panel`, `data-target`, and `.is-active` by exact name.

- [ ] **Step 1: Add the pricing preview to `index.html`**

```html
<section class="pricing-preview section section--dark">
  <div class="container">
    <p class="eyebrow">Цены</p>
    <h2>Выбирай формат — не переплачивай за лишнее</h2>
    <p>От разовой тренировки до пакета на 64 занятия — 24 варианта абонементов для группы, персональных и сплит-тренировок.</p>
    <a class="btn btn-primary" href="pricing.html">Смотреть все тарифы</a>
  </div>
</section>
```

- [ ] **Step 2: Add the full pricing markup to `pricing.html`**

```html
<section class="section">
  <div class="container">
    <p class="eyebrow">Цены</p>
    <h1>Тарифы Некачалки</h1>
    <div class="price-tabs" role="tablist">
      <button class="price-tab is-active" data-target="group" role="tab" aria-selected="true">Групповые</button>
      <button class="price-tab" data-target="personal" role="tab" aria-selected="false">Персональные</button>
      <button class="price-tab" data-target="split" role="tab" aria-selected="false">Сплит</button>
      <button class="price-tab" data-target="masterclass" role="tab" aria-selected="false">Мастер-классы</button>
    </div>

    <div class="price-panel is-active" id="group" role="tabpanel">
      <ul class="price-list">
        <li class="price-row"><span>Пробная групповая тренировка</span><span>600 ₽ <s>1 200 ₽</s></span><a class="btn btn-outline" href="https://taplink.cc/nekachalka/o/b57560/">Купить</a></li>
        <li class="price-row"><span>Групповая тренировка</span><span>1 100 ₽</span><a class="btn btn-outline" href="https://taplink.cc/nekachalka/o/b57566/">Купить</a></li>
        <li class="price-row"><span>4 групповых тренировки</span><span>3 590 ₽</span><a class="btn btn-outline" href="https://taplink.cc/nekachalka/o/b5756a/">Купить</a></li>
        <li class="price-row"><span>8 групповых тренировок</span><span>6 790 ₽</span><a class="btn btn-outline" href="https://taplink.cc/nekachalka/o/b5756e/">Купить</a></li>
        <li class="price-row"><span>12 групповых тренировок</span><span>8 990 ₽</span><a class="btn btn-outline" href="https://taplink.cc/nekachalka/o/b5756f/">Купить</a></li>
        <li class="price-row"><span>16 групповых тренировок</span><span>11 190 ₽</span><a class="btn btn-outline" href="https://taplink.cc/nekachalka/o/b57576/">Купить</a></li>
        <li class="price-row"><span>24 групповые тренировки</span><span>15 590 ₽</span><a class="btn btn-outline" href="https://taplink.cc/nekachalka/o/b5757c/">Купить</a></li>
        <li class="price-row"><span>32 групповые тренировки</span><span>19 190 ₽</span><a class="btn btn-outline" href="https://taplink.cc/nekachalka/o/b5757d/">Купить</a></li>
        <li class="price-row"><span>64 групповые тренировки</span><span>35 190 ₽</span><a class="btn btn-outline" href="https://taplink.cc/nekachalka/o/be7d55/">Купить</a></li>
      </ul>
    </div>

    <div class="price-panel" id="personal" role="tabpanel" hidden>
      <ul class="price-list">
        <li class="price-row"><span>Пробная персональная тренировка</span><span>1 000 ₽ <s>2 200 ₽</s></span><a class="btn btn-outline" href="https://taplink.cc/nekachalka/o/b5755b/">Купить</a></li>
        <li class="price-row"><span>Персональная тренировка</span><span>2 100 ₽</span><a class="btn btn-outline" href="https://taplink.cc/nekachalka/o/b57564/">Купить</a></li>
        <li class="price-row"><span>4 персональные тренировки</span><span>7 990 ₽</span><a class="btn btn-outline" href="https://taplink.cc/nekachalka/o/b5757e/">Купить</a></li>
        <li class="price-row"><span>8 персональных тренировок</span><span>14 390 ₽</span><a class="btn btn-outline" href="https://taplink.cc/nekachalka/o/b57581/">Купить</a></li>
        <li class="price-row"><span>12 персональных тренировок</span><span>20 390 ₽</span><a class="btn btn-outline" href="https://taplink.cc/nekachalka/o/b57583/">Купить</a></li>
        <li class="price-row"><span>16 персональных тренировок</span><span>25 590 ₽</span><a class="btn btn-outline" href="https://taplink.cc/nekachalka/o/b57584/">Купить</a></li>
        <li class="price-row"><span>24 персональные тренировки</span><span>35 990 ₽</span><a class="btn btn-outline" href="https://taplink.cc/nekachalka/o/b5758a/">Купить</a></li>
        <li class="price-row"><span>32 персональные тренировки</span><span>44 790 ₽</span><a class="btn btn-outline" href="https://taplink.cc/nekachalka/o/b5758b/">Купить</a></li>
        <li class="price-row"><span>64 персональные тренировки</span><span>83 190 ₽</span><a class="btn btn-outline" href="https://taplink.cc/nekachalka/o/be7d56/">Купить</a></li>
      </ul>
    </div>

    <div class="price-panel" id="split" role="tabpanel" hidden>
      <ul class="price-list">
        <li class="price-row"><span>Пробная сплит-тренировка</span><span>1 300 ₽ <s>2 600 ₽</s></span><a class="btn btn-outline" href="https://taplink.cc/nekachalka/o/bdf100/">Купить</a></li>
        <li class="price-row"><span>Сплит-тренировка</span><span>2 600 ₽</span><a class="btn btn-outline" href="https://taplink.cc/nekachalka/o/bdf104/">Купить</a></li>
        <li class="price-row"><span>4 сплит-тренировки</span><span>9 190 ₽</span><a class="btn btn-outline" href="https://taplink.cc/nekachalka/o/bdf10b/">Купить</a></li>
        <li class="price-row"><span>8 сплит-тренировок</span><span>17 590 ₽</span><a class="btn btn-outline" href="https://taplink.cc/nekachalka/o/c60f01/">Купить</a></li>
        <li class="price-row"><span>12 сплит-тренировок</span><span>25 190 ₽</span><a class="btn btn-outline" href="https://taplink.cc/nekachalka/o/c60f06/">Купить</a></li>
      </ul>
    </div>

    <div class="price-panel" id="masterclass" role="tabpanel" hidden>
      <ul class="price-list">
        <li class="price-row"><span>Мастер-класс</span><span>2 000 ₽</span><a class="btn btn-outline" href="https://taplink.cc/nekachalka/o/c03ee0/">Купить</a></li>
      </ul>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Add styles**

```css
/* === PRICING PREVIEW === */
.pricing-preview .container { max-width: 640px; text-align: center; }
.pricing-preview .btn { margin-top: 20px; }

/* === PRICING PAGE === */
.price-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 24px 0 32px;
}
.price-tab {
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 0.9rem;
  padding: 10px 20px;
  border-radius: 999px;
  border: 2px solid var(--color-text);
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
}
.price-tab.is-active { background: var(--color-text); color: var(--color-on-dark); }

.price-list { display: flex; flex-direction: column; gap: 12px; }
.price-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
  background: var(--color-bg-alt);
  border-radius: var(--radius-md);
}
.price-row span:first-child { font-weight: 700; }
.price-row s { color: var(--color-text-muted); font-weight: 400; margin-left: 8px; }
```

- [ ] **Step 4: Verify (before JS exists, panels other than "group" are hidden by the `hidden` attribute — this is expected)**

Use the `webapp-testing` skill to reload `http://localhost:8000/index.html` and `http://localhost:8000/pricing.html`.
Expected on `index.html`: a dark preview block with the "Смотреть все тарифы" button linking to `pricing.html`. Expected on `pricing.html`: four tab buttons render; the "Групповые" panel with 9 rows is visible; the other three panels exist in the DOM but are hidden (via the `hidden` attribute) since the tab-switching JS is not written until Task 6 — clicking a tab button does nothing yet. Confirm all 24 `taplink.cc/nekachalka/o/...` links are present by counting `<a>` tags inside `.price-list`.

- [ ] **Step 5: Commit**

```bash
git add index.html pricing.html css/style.css
git commit -m "Add pricing preview and full 24-item price list"
```

---

### Task 6: Pricing tabs JavaScript

**Files:**
- Create: `js/script.js`
- Modify: `pricing.html` (already links the script from Task 1's skeleton — verify the `<script>` tag is present before `</body>`)

**Interfaces:**
- Consumes: `.price-tab`, `.price-panel`, `data-target` attribute, `.is-active` class, `hidden` attribute — all defined in Task 5.
- Produces: no new names for other tasks to consume (this is a leaf/terminal behavior).

- [ ] **Step 1: Write `js/script.js`, including handling for deep links like `pricing.html#personal`**

Homepage service cards (Task 3) link to `pricing.html#personal`, `#group`, `#split`. Without extra handling, the browser would try to scroll to the `#personal` panel while it still carries the `hidden` attribute from Task 5 (only `#group` is visible by default) and fail silently, leaving the wrong tab marked active. The `activateTab` helper below is shared by both the click handler and the initial-hash check so the two stay in sync:

```js
document.addEventListener('DOMContentLoaded', function () {
  var tabs = document.querySelectorAll('.price-tab');
  var panels = document.querySelectorAll('.price-panel');

  function activateTab(targetId) {
    tabs.forEach(function (t) {
      var isMatch = t.getAttribute('data-target') === targetId;
      t.classList.toggle('is-active', isMatch);
      t.setAttribute('aria-selected', isMatch ? 'true' : 'false');
    });
    panels.forEach(function (panel) {
      if (panel.id === targetId) {
        panel.classList.add('is-active');
        panel.removeAttribute('hidden');
      } else {
        panel.classList.remove('is-active');
        panel.setAttribute('hidden', '');
      }
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      activateTab(tab.getAttribute('data-target'));
    });
  });

  var initialId = window.location.hash.replace('#', '');
  var hasMatchingTab = initialId && document.querySelector('.price-tab[data-target="' + initialId + '"]');
  if (hasMatchingTab) {
    activateTab(initialId);
    document.getElementById(initialId).scrollIntoView({ block: 'start' });
  }
});
```

- [ ] **Step 2: Verify tab switching and deep links both work**

Use the `webapp-testing` skill to open `http://localhost:8000/pricing.html`, click the "Персональные" tab button, and inspect the DOM.
Expected: the `#personal` panel loses its `hidden` attribute and gains `.is-active`; the `#group` panel gains `hidden` and loses `.is-active`; the clicked tab button visually changes (dark background) and its `aria-selected` becomes `"true"` while the others become `"false"`. Repeat for "Сплит" and "Мастер-классы" to confirm all four panels switch correctly, then click back to "Групповые" to confirm it still works both ways. Then open `http://localhost:8000/pricing.html#split` directly and confirm the "Сплит" tab is active and its panel visible on load, without clicking anything.

- [ ] **Step 3: Commit**

```bash
git add js/script.js
git commit -m "Wire up pricing category tabs"
```

---

### Task 7: Reviews + Contacts + shared Footer

**Files:**
- Modify: `index.html` (insert after pricing preview, before footer; also fill in the footer content)
- Modify: `pricing.html` (fill in the same footer content, copied verbatim)
- Modify: `css/style.css` (append)

**Interfaces:**
- Consumes: `.section`, `.section--dark`, `.container`, `.eyebrow`, `.btn`, `.btn-outline` from Task 1.
- Produces: `.reviews`, `.contacts`, `.contacts__grid`, `.site-footer__grid`, `.social-links` classes.

- [ ] **Step 1: Add Reviews section markup to `index.html`**

```html
<section class="reviews section">
  <div class="container">
    <p class="eyebrow">Отзывы</p>
    <h2>Рейтинг 5.0</h2>
    <p>Оценки и отзывы реальных клиентов на Яндекс.Картах.</p>
    <a class="btn btn-outline" href="https://yandex.ru/maps/org/189149703795/reviews?utm_source=badge&utm_medium=rating&utm_campaign=v1" target="_blank" rel="noopener">Читать отзывы на Яндекс.Картах</a>
  </div>
</section>
```

- [ ] **Step 2: Add Contacts section markup to `index.html`**

```html
<section class="contacts section section--alt">
  <div class="container">
    <p class="eyebrow">Контакты</p>
    <h2>Возникли вопросы — напиши нам!</h2>
    <div class="contacts__grid">
      <a class="btn btn-primary" href="https://t.me/nekachalka?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%21%20%D0%A0%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D0%B6%D0%B8%D1%82%D0%B5%20%D0%BF%D0%BE%D0%B4%D1%80%D0%BE%D0%B1%D0%BD%D0%B5%D0%B5%20%D0%BE%20%D0%B2%D0%B0%D1%88%D0%B8%D1%85%20%D0%B7%D0%B0%D0%BD%D1%8F%D1%82%D0%B8%D1%8F%D1%85.">Узнать подробнее о занятиях</a>
      <a class="btn btn-outline" href="https://max.ru/u/89992161077" target="_blank" rel="noopener">Задать вопрос в Max</a>
      <a class="btn btn-outline" href="https://r557443.mobi.fitness/" target="_blank" rel="noopener">Расписание групповых занятий</a>
      <a class="btn btn-outline" href="tel:+79992161077">Позвонить: +7 999 216-10-77</a>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Write the shared footer content — add identically to `index.html` and `pricing.html` inside the existing `<footer class="site-footer ...">` container**

```html
<div class="site-footer__grid">
  <div>
    <p class="logo-mark">НЕКАЧАЛКА</p>
    <p>Фитнес пространство</p>
    <div class="social-links">
      <a href="https://instagram.com/nekachalka/" target="_blank" rel="noopener">Instagram</a>
      <a href="https://vk.com/nekachalka_spb" target="_blank" rel="noopener">ВКонтакте</a>
    </div>
  </div>
  <div>
    <p><a href="https://docs.google.com/document/d/1Hm2_6ja7xSxBPGgTs1m_QJngKD6uxJ3sMvOJAq37H48/edit?usp=sharing" target="_blank" rel="noopener">Договор об оказании физкультурно-оздоровительных услуг</a></p>
    <p>Реквизиты:<br>
    ИП Попова Ольга Сергеевна<br>
    ИНН: 420216779496<br>
    ОГРНИП: 323420500010682</p>
  </div>
</div>
```

- [ ] **Step 4: Add styles**

```css
/* === REVIEWS === */
.reviews .container { max-width: 640px; }

/* === CONTACTS === */
.contacts__grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 24px;
}

/* === FOOTER === */
.site-footer__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
}
.social-links { display: flex; gap: 16px; margin-top: 12px; }
.social-links a { text-decoration: underline; }
```

- [ ] **Step 5: Verify**

Use the `webapp-testing` skill to reload both pages.
Expected: Reviews section links to the real Yandex Maps reviews URL; Contacts section has four working links (`https://t.me/...`, `https://max.ru/u/89992161077`, `https://r557443.mobi.fitness/`, `tel:+79992161077`); footer on both pages shows identical content — Instagram/VK links, the Google Docs contract link, and the ИП/ИНН/ОГРНИП text exactly as listed in the spec.

- [ ] **Step 6: Commit**

```bash
git add index.html pricing.html css/style.css
git commit -m "Add Reviews, Contacts, and shared Footer sections"
```

---

### Task 8: Responsive layout (tablet + desktop)

**Files:**
- Modify: `css/style.css` (append at the very end)

**Interfaces:**
- Consumes every class produced in Tasks 1–7. Produces no new class names — only adds `@media` rules targeting existing selectors.

- [ ] **Step 1: Add tablet and desktop media queries**

```css
/* === RESPONSIVE: TABLET (>=768px) === */
@media (min-width: 768px) {
  .section { padding: 80px 0; }
  .hero { padding: 100px 0 88px; }
  .services__grid { grid-template-columns: repeat(2, 1fr); }
  .gallery__grid { grid-template-columns: repeat(2, 1fr); }
  .site-footer__grid { grid-template-columns: repeat(2, 1fr); }
  .contacts__grid { flex-wrap: nowrap; }
}

/* === RESPONSIVE: DESKTOP (>=1200px) === */
@media (min-width: 1200px) {
  .section { padding: 112px 0; }
  .hero { padding: 128px 0 112px; }
  .services__grid { grid-template-columns: repeat(3, 1fr); }
  .price-row {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  .price-row a.btn { margin-left: auto; }
}
```

- [ ] **Step 2: Verify at three widths**

Use the `webapp-testing` skill to open `http://localhost:8000/index.html` and `http://localhost:8000/pricing.html`, setting the viewport to 375px, 768px, and 1280px wide at each step (screenshot each).
Expected: at 375px, all grids are single-column and nothing overflows horizontally (no horizontal scrollbar on `<body>`); at 768px, service cards and gallery images sit two-per-row; at 1280px, service cards sit three-per-row and each pricing row lays its label, price, and button out horizontally instead of stacked. Confirm by reading computed `grid-template-columns` / `flex-direction` at each width, not just eyeballing the screenshot.

- [ ] **Step 3: Commit**

```bash
git add css/style.css
git commit -m "Add tablet and desktop responsive breakpoints"
```

---

### Task 9: Final polish — meta tags, full link audit

**Files:**
- Modify: `index.html` (add meta description + Open Graph tags to `<head>`)
- Modify: `pricing.html` (add meta description to `<head>`)
- Create: `scripts/audit_links.py`

**Interfaces:**
- Consumes: `assets/img/logo.png`, created in Task 1, as the Open Graph share image.
- No CSS/HTML class interfaces produced; this task only adds metadata and a one-off verification script.

- [ ] **Step 1: Add meta description + Open Graph tags to `index.html`'s `<head>`, right after the `<title>` line**

```html
<meta name="description" content="Некачалка — фитнес-пространство в Санкт-Петербурге. Персональные и групповые тренировки: фитнес, танцы, растяжка, пилатес, бокс. Пробное занятие от 600 ₽.">
<meta property="og:title" content="Некачалка — фитнес-пространство в Санкт-Петербурге">
<meta property="og:description" content="Персональные и групповые тренировки: фитнес, танцы, растяжка, пилатес, бокс. Пробное занятие от 600 ₽.">
<meta property="og:type" content="website">
<meta property="og:image" content="assets/img/logo.png">
```

- [ ] **Step 2: Add a meta description to `pricing.html`'s `<head>`, right after the `<title>` line**

```html
<meta name="description" content="Полный прайс-лист Некачалки: групповые, персональные и сплит-тренировки, мастер-классы. 24 варианта абонементов.">
```

- [ ] **Step 3: Write a stdlib-only link audit script**

```python
"""Extract every href/src from index.html and pricing.html for manual review against the spec's link table."""
import re
import pathlib

ATTR_RE = re.compile(r'(?:href|src)="([^"]+)"')

for filename in ("index.html", "pricing.html"):
    path = pathlib.Path(__file__).parent.parent / filename
    text = path.read_text(encoding="utf-8")
    links = ATTR_RE.findall(text)
    print(f"\n{filename} ({len(links)} links):")
    for link in links:
        print(f"  {link}")
```

- [ ] **Step 4: Run the audit and check against the spec**

Run: `python scripts/audit_links.py`
Expected: every external link printed matches one of the real URLs in the spec's link table (Telegram `https://t.me/nekachalka?text=...`, WhatsApp `https://wa.me/79992161077?text=...`, `https://max.ru/u/89992161077`, `tel:+79992161077`, `https://r557443.mobi.fitness/`, the 24 `https://taplink.cc/nekachalka/o/<id>/` checkout links, `https://yandex.ru/maps/org/189149703795/reviews...`, `https://instagram.com/nekachalka/`, `https://vk.com/nekachalka_spb`, the Google Docs contract link) plus internal links (`index.html`, `pricing.html`, `pricing.html#group` etc., `css/style.css`, `js/script.js`, `assets/img/...`). No `href="#"` placeholders should appear anywhere in the output — if one does, find and fix the section that introduced it.

- [ ] **Step 5: Final full-page smoke test**

Use the `webapp-testing` skill to open both pages one more time at 375px and 1280px and click through: hero CTA, one service card link, both gallery images load, a pricing tab switch, one "Купить" button (confirm it navigates to `taplink.cc`, don't complete a purchase), the reviews link, and both footer social links.
Expected: no console errors on either page, no broken images, no dead internal anchors (`pricing.html#group` scrolls to/shows the group panel).

- [ ] **Step 6: Commit**

```bash
git add index.html pricing.html scripts/audit_links.py
git commit -m "Add meta tags and link audit script for final QA"
```
