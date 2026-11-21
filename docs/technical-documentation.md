# Technical Documentation – Assignment 3

## Contents

1. [Overview](#1-overview)
2. [Architecture](#2-architecture)
3. [API Integration – GitHub](#3-api-integration--github)
4. [Complex Logic](#4-complex-logic)
5. [State Management](#5-state-management)
6. [Styling and Dark Mode](#6-styling-and-dark-mode)
7. [Performance](#7-performance)
8. [Compatibility and Accessibility](#8-compatibility-and-accessibility)
9. [Testing](#9-testing)
10. [Limitations and Future Work](#10-limitations-and-future-work)

---

## 1. Overview

A one-page portfolio website made with HTML, CSS, and JavaScript, without frameworks or libraries. It runs fully in the browser; the only external service is the GitHub REST API.

| Part | Technology |
|------|-----------|
| Structure | HTML5 |
| Styling | CSS3 (custom properties, Flexbox, Grid, media queries) |
| Behaviour | JavaScript (ES2018+), one file loaded with `defer` |
| Data | GitHub REST API, `localStorage`, `sessionStorage` |

### What changed from Assignment 2

| Area | Assignment 2 | Assignment 3 |
|------|--------------|--------------|
| GitHub API | Repository names only, one error message | Cards with details, cache, timeout, specific error messages, retry |
| Projects | 2 projects, category filter + search | 4 projects, + level choice + sorting |
| Contact form | Checks on submit, `@` and `.` email check | Live checks, regular expression, counter, disabled Send until valid |
| State | Dark mode | Dark mode (follows system, no flash), visitor name, visit counter |
| Timer | – | Time-on-site timer that pauses on hidden tabs |
| Images | 576 KB (PNG inside SVG) | 46 KB (WebP), lazy loaded |
| CSS | Colors repeated for dark mode | CSS variables, no repeated rules |
| JavaScript | Features in mixed order, `.then()` | 9 numbered sections, `async/await`, safe storage helper |

---

## 2. Architecture

### Files

| File | Purpose |
|------|---------|
| `index.html` | Content and sections. A small inline script in `<head>` applies the saved theme before the page is drawn. |
| `css/styles.css` | 11 numbered sections: colors, base, header, hero, about, projects, GitHub, forms, footer, animations, responsive. |
| `js/script.js` | 9 numbered sections (listed at the top of the file). |
| `assets/images/` | `classroom-reservation.webp`, `unibus-project.webp`, `portfolio-v1.svg`, `portfolio-v2.svg`, `profile-placeholder.svg`, `favicon.svg`. |

### Page sections

1. **Header:** logo link, navigation, theme button
2. **Hero:** greeting, visit message, visitor name form
3. **About Me:** skills and student information
4. **My Projects:** level picker, search, category buttons, sort menu, project cards
5. **GitHub:** repository cards from the API
6. **Contact Me:** validated form
7. **Footer:** year and time-on-site timer

### Script loading order

```
<head>
  inline script  → adds "js" class, applies saved/system theme   (runs before first paint)
  script.js      → loaded with defer, runs after the HTML is parsed
```

`script.js` sections:

| # | Section | Main functions |
|---|---------|----------------|
| 1 | Safe storage helper | `storage.get()`, `storage.set()` |
| 2 | Dark mode | `updateThemeButton()` |
| 3 | Greeting and visitor name | `getTimeGreeting()`, `showGreeting()` |
| 4 | Visit counter | `toOrdinal()` |
| 5 | Projects | `sortProjects()`, `updateProjects()` |
| 6 | GitHub repositories | `loadRepos()`, `getCachedRepos()`, `showRepos()`, `createRepoItem()`, `timeAgo()`, `getErrorMessage()` |
| 7 | Contact form | `checkField()`, `updateFormState()`, `updateMessageCount()`, `resetContactForm()` |
| 8 | Footer and timer | `formatTime()`, `getSecondsOnPage()` |
| 9 | Fade-in on scroll | `IntersectionObserver` callback |

---

## 3. API Integration – GitHub

**Endpoint:** `GET https://api.github.com/users/TWFHD/repos?sort=updated&per_page=10`
No API key is needed. GitHub allows **60 requests per hour** per IP address without login.

### Flow of `loadRepos()`

```
loadRepos()
 ├─ cache in sessionStorage is younger than 10 minutes?
 │    └─ yes → showRepos(cached) → done (no request)
 ├─ show "Loading repositories..."
 ├─ start an 8-second timer that calls controller.abort()
 ├─ try
 │    ├─ response = await fetch(url, { signal })
 │    ├─ if !response.ok → throw an error with response.status
 │    ├─ repos = await response.json()
 │    ├─ save { time, repos } in sessionStorage
 │    └─ showRepos(repos)
 ├─ catch → clear the list, show getErrorMessage(error), show "Try again"
 └─ finally → clearTimeout(timer)
```

### Displaying the data

- Forks are removed (`!repo.fork`) and at most 6 repositories are shown.
- Each card shows the name (link), description (or "No description yet."), language, stars, and "Updated … ago".
- `timeAgo()` uses the built-in `Intl.RelativeTimeFormat` to turn `pushed_at` into text such as "3 days ago" or "last month".
- All API values are inserted with `textContent`, never `innerHTML`, so text from the API cannot run as HTML or script.
- Links that open in a new tab use `rel="noopener"`.

### Error handling

| Situation | How it is detected | Message |
|-----------|--------------------|---------|
| No internet | `navigator.onLine === false` | "You seem to be offline. Please check your internet connection." |
| Slow response (> 8 s) | `error.name === "AbortError"` | "GitHub is taking too long to answer. Please try again." |
| Rate limit | status `403` or `429` | "GitHub's request limit was reached. Please try again in a few minutes." |
| Anything else | other errors | "Sorry, the repositories could not be loaded right now." |

In every error case a **Try again** button appears and calls `loadRepos()` again. The status line uses `aria-live="polite"`, so screen readers announce changes.

---

## 4. Complex Logic

### 4.1 Projects: level + category + search + sort

Each project card stores its data in attributes:

```html
<article class="project-card" data-category="web" data-level="advanced" data-date="2026-09">
```

`updateProjects()` runs whenever any control changes:

1. **Sort** – `sortProjects()` copies the cards into an array (`Array.from`), sorts it, and appends each card again in the new order (`appendChild` moves an existing element instead of copying it).
   - *Newest / Oldest*: compares `data-date`. Because the format is `YYYY-MM`, comparing the text with `localeCompare` gives the correct date order.
   - Projects with the **same date** are sorted by name (second rule).
   - *Name*: compares the `<h3>` text.
2. **Filter** – a card is visible only if **all three** checks pass:
   ```js
   const show = matchesFilter && matchesLevel && matchesSearch;
   ```
3. **Empty state** – visible cards are counted; if the count is 0, "No projects found. Try another word, category, or level." is shown.

### 4.2 Content based on the visitor's choice

A radio group asks "What is your experience level?". The messages are stored in an object, so no long `if/else` chain is needed:

```js
const levelMessages = { all: "...", beginner: "...", advanced: "..." };
levelMessage.textContent = levelMessages[currentLevel];
levelMessage.className = "level-message " + currentLevel; // changes the border color
```

### 4.3 Contact form validation

Rules are kept in one object; each rule returns an error message, or `""` when the value is valid:

| Field | Rules |
|-------|-------|
| Name | required, at least 2 characters |
| Email | required, must match `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/` |
| Message | required, 10–500 characters (`maxlength="500"` in HTML) |

Step-by-step behaviour:

1. While the visitor types in a field **for the first time**, no error is shown.
2. When they leave the field (`blur`), it is marked as *touched* and its error is shown; from then on the error updates on every key press.
3. After every change, `updateFormState()` checks all fields. The **Send** button is enabled only when all are valid, and a hint explains why it is disabled.
4. On submit, all fields are marked as touched and checked again (in case the button state was changed).
5. The button shows "Sending..." for 1 second (simulated), then a thank-you message appears and the form is reset, keeping the saved visitor name.

The message counter (`37 / 500`) turns red in the last 50 characters. Invalid fields get `aria-invalid="true"` (red border), and each field is linked to its error with `aria-describedby`.

Email examples: `name@example.com` ✓, `sara@kfupm.edu.sa` ✓, `a@b` ✗, `a@b.c` ✗, `a@.com` ✗, `a b@c.com` ✗.

### 4.4 Visitor name check

`/^[\p{L} ]{2,20}$/u` – `\p{L}` matches a letter in **any language**, so English and Arabic names are accepted, while digits and symbols are rejected. When the name changes, the contact form's name field is updated only if it is empty or still has the old saved name, so a name the visitor typed there is not overwritten.

### 4.5 Time-on-site timer

The timer counts only the time the page is **visible**:

```
savedSeconds  = time collected before the last pause
startTime     = when the current visible period started (null while paused)
seconds now   = savedSeconds + (Date.now() - startTime) / 1000
```

- `visibilitychange` → hidden: save the time so far and set `startTime = null`; visible again: `startTime = Date.now()`.
- The display updates every second with `setInterval`, but the value is always calculated from `Date.now()`. Adding 1 each second would drift, because timers can run late.
- `formatTime()` shows `MM:SS`, or `H:MM:SS` after one hour (`padStart(2, "0")` adds the leading zero).

### 4.6 Visit counter and ordinals

`toOrdinal()` handles English ordinals including the special cases 11th, 12th, and 13th: 1st, 2nd, 3rd, 4th, 11th, 21st, 22nd, 111th.

---

## 5. State Management

| Key | Storage | Value | Used for |
|-----|---------|-------|----------|
| `theme` | `localStorage` | `"light"` / `"dark"` | Theme choice |
| `visitorName` | `localStorage` | e.g. `"Sara"` | Greeting and contact form |
| `visitCount` | `localStorage` | number as text | Visit message |
| `githubRepos` | `sessionStorage` | `{ time, repos }` as JSON | 10-minute API cache |

- `localStorage` keeps data after the browser is closed; `sessionStorage` is cleared when the tab is closed, which suits a short cache.
- Storage only saves text, so `visitCount` is converted with `Number()` before adding 1 (otherwise `"1" + 1` would give `"11"`), and the cache uses `JSON.stringify` / `JSON.parse`.
- **Safe storage helper:** some browsers block storage (private mode, strict privacy settings) and throw an error. `storage.get()` / `storage.set()` and the cache functions wrap storage in `try/catch`, so the site still works and only forgets the choices.
- Page state that does not need saving (current filter, level, touched fields, timer) is kept in normal variables.

---

## 6. Styling and Dark Mode

All colors are **CSS custom properties**. Dark mode only redefines the variables, so no rule is written twice:

```css
:root               { --bg: #ffffff; --primary: #2f5da8; ... }
[data-theme="dark"] { --bg: #121826; --primary: #8db4ff; ... }
body { background-color: var(--bg); }
```

How the theme is chosen:

1. A small inline script in `<head>` runs **before the page is drawn**: it uses the saved theme, or the device setting (`prefers-color-scheme: dark`) if nothing is saved, and sets `data-theme` on `<html>`. This prevents a white flash when a dark-mode visitor opens the page.
2. The theme button switches the attribute, saves the choice, and updates its text and `aria-pressed`.
3. `color-scheme` is set for each theme, so browser parts such as form controls and scrollbars match.

The fade-in animation only hides sections when the `js` class exists on `<html>`, so if JavaScript fails, all content is still visible.

---

## 7. Performance

### Lighthouse results

Tested with Chrome DevTools Lighthouse on `http://localhost:5501`:

| Device | Performance | Accessibility | Best Practices | SEO |
|--------|:-----------:|:-------------:|:--------------:|:---:|
| Mobile | 100 | 100 | 100 | 100 |
| Desktop | 100 | 100 | 100 | 100 |

### Optimizations

| Optimization | Detail |
|--------------|--------|
| Image compression | The two project images were SVG files that contained large PNG screenshots. They were rebuilt as 960×600 WebP images: **576 KB → 46 KB (−92 %)**. |
| Lazy loading | Project images use `loading="lazy"`, so they load only when they are close to the screen. |
| No layout shift | All images have `width` and `height`. |
| Deferred script | `script.js` uses `defer`, so it does not block the page from being drawn. |
| Preconnect | `<link rel="preconnect" href="https://api.github.com">` starts the connection early. |
| API cache | Repositories are cached for 10 minutes in `sessionStorage`, avoiding repeated requests and the rate limit. |
| Request timeout | `AbortController` stops a slow request after 8 seconds. |
| Efficient scroll animation | `IntersectionObserver` instead of a `scroll` listener; each section is unobserved after it appears. |
| Less CSS | CSS variables replaced the duplicated dark-mode rules. |
| No libraries | No frameworks or external scripts; the whole site is a few small files. |
| Removed unused files | The old large SVG images were deleted; the unused favicon is now linked. |

---

## 8. Compatibility and Accessibility

### Browsers

The site uses standard features supported by current versions of **Chrome, Edge, Firefox, and Safari** (desktop and mobile): `fetch`, `async/await`, `AbortController`, `IntersectionObserver`, `Intl.RelativeTimeFormat`, Unicode regular expressions (`\p{L}`), CSS Grid, Flexbox, and custom properties.

Fallbacks:
- No `IntersectionObserver` → sections are shown immediately.
- Blocked storage → features work without remembering choices.
- No JavaScript → all content is visible (only interactive features are missing).

### Responsive design

- Breakpoint at **700px**: navigation and hero stack vertically, project cards use one column, category buttons fill the width.
- Repository cards use `repeat(auto-fill, minmax(280px, 1fr))`, so the number of columns adapts to the screen.
- Tested at 375px width (mobile) with no horizontal scrolling.

### Accessibility

- Labels for every input; the level choice uses a `fieldset` and `legend`.
- `aria-pressed` on toggle buttons, `aria-invalid` and `aria-describedby` on form fields, `aria-live` on changing messages.
- Visible focus outline (`:focus-visible`), keyboard-friendly native controls.
- `prefers-reduced-motion` turns off animations for visitors who disabled them.
- Correct heading order (one `<h1>`; the logo is a link, not a heading), `lang="en"`, alt text on all images.

---

## 9. Testing

All tests were done in the browser, in light and dark mode, and at desktop and mobile (375px) widths. The console showed no errors.

| # | Test | Expected result | Result |
|---|------|-----------------|--------|
| 1 | Open the page | Repositories load with description, language, stars, and date | ✅ |
| 2 | Reload within 10 minutes | Repositories appear without a new request (cache) | ✅ |
| 3 | GitHub returns 403 | Rate-limit message and **Try again** button | ✅ |
| 4 | GitHub does not answer | After 8 seconds: "taking too long" message | ✅ |
| 5 | Press **Try again** after an error | Repositories load and the button hides | ✅ |
| 6 | Sort: Newest / Oldest / Name | v2, Classroom, v1, UNIBus / reverse / alphabetical | ✅ |
| 7 | Level: Beginner | Only the two portfolio projects; beginner message | ✅ |
| 8 | Level: Advanced + Mobile | Only UNIBus | ✅ |
| 9 | Level: Beginner + Mobile | "No projects found" message | ✅ |
| 10 | Search "bus" | Only UNIBus | ✅ |
| 11 | Save name "A" / "Sara123" | Error: "Please enter 2 to 20 letters." | ✅ |
| 12 | Save name "سارة" or "Sara" | Greeting uses the name, form hides, contact name filled | ✅ |
| 13 | Reload the page | Name kept, visit counter increases ("2nd visit") | ✅ |
| 14 | Change name | Greeting and contact name update; a different name typed in the contact form is kept | ✅ |
| 15 | Ordinals | 1st 2nd 3rd 4th 11th 12th 13th 21st 22nd 23rd 101st 111th | ✅ |
| 16 | Type an invalid email without leaving the field | No error yet | ✅ |
| 17 | Leave the email field with "bad@x" | Email error and red border | ✅ |
| 18 | Message "Hi" | "Your message needs 8 more characters." | ✅ |
| 19 | All fields valid | **Send** becomes active, hint disappears | ✅ |
| 20 | Send | "Sending..." → thank-you message → form cleared, saved name kept | ✅ |
| 21 | Type 470+ characters | Counter turns red; cannot type past 500 | ✅ |
| 22 | Timer | Increases every second; hidden tab time is not counted | ✅ |
| 23 | Dark mode, then reload | Stays dark, no white flash | ✅ |
| 24 | First visit with the device in dark mode | Page opens in dark mode | ✅ |
| 25 | Mobile width 375px | One column, no horizontal scroll | ✅ |
| 26 | Lighthouse mobile and desktop | 100 in all four categories | ✅ |

---

## 10. Limitations and Future Work

- The contact form does not send messages to a server; it only simulates sending. A service such as Formspree could be added later.
- Without login, the GitHub API allows 60 requests per hour; the cache reduces requests, but a visitor who clears storage often could still reach the limit.
- The project list is written in the HTML. In the future it could be loaded from a JSON file or from GitHub topics so new projects appear automatically.
- The level and sort choices are not saved between visits.
