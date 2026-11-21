# Fahad's Portfolio – Assignment 3

A personal portfolio website built with plain HTML, CSS, and JavaScript (no frameworks).
Assignment 3 builds on [Assignment 2](https://github.com/TWFHD/202370250-FahadAltuwayjiri-assignment2) and adds advanced features: a richer GitHub API integration, projects that can be filtered and sorted, content that changes with the visitor's choices, a timer, saved visitor preferences, and performance improvements.

**Lighthouse score: 100 / 100 / 100 / 100** (Performance, Accessibility, Best Practices, SEO) on both mobile and desktop.

---

## Features

### New in Assignment 3

| Feature | What it does |
|---------|--------------|
| **GitHub repositories (API)** | Loads my latest repositories live from the GitHub REST API and shows the description, language, stars, and "updated … ago". Results are cached for 10 minutes, the request stops after 8 seconds, and each kind of error (offline, rate limit, timeout) has its own message and a **Try again** button. |
| **Project sorting** | Sort projects by *Newest first*, *Oldest first*, or *Name (A–Z)*. Works together with the category filter, the level choice, and the search box. |
| **Level choice** | Visitors pick *Beginner* or *Advanced*; the matching projects and a different explanation message are shown. |
| **Visitor name** | The visitor can save their name. It is remembered, used in the greeting ("Good evening, Sara!"), and filled into the contact form. |
| **Visit counter** | "This is your 3rd visit. Thanks for coming back!" |
| **Time-on-site timer** | The footer shows how long the visitor has been on the page. It pauses while the tab is hidden. |
| **Stronger contact form** | Live validation, a proper email check, a character counter, and the **Send** button stays disabled until every field is valid. |
| **Better dark mode** | Saved choice, follows the device setting on the first visit, and no white flash when the page opens. |
| **Performance** | Project images compressed from 576 KB to 46 KB (WebP), lazy loading, deferred script, and CSS variables instead of repeated rules. |

### From Assignments 1 and 2

- About Me section with skills and student information
- Project category filter (Web / Mobile) and live search
- Fade-in animations while scrolling, hover effects
- Responsive layout for desktop, tablet, and mobile

---

## How to Run Locally

**Requirements:** a modern web browser (Chrome, Edge, Firefox, or Safari). An internet connection is only needed for the GitHub section.

### Option 1 – Open the file (quickest)

1. Clone the repository:
   ```bash
   git clone https://github.com/TWFHD/202370250-FahadAltuwayjiri-assignment3.git
   ```
2. Open the `202370250-FahadAltuwayjiri-assignment3` folder.
3. Double-click `index.html`.

### Option 2 – Use a local server (recommended for Lighthouse)

Some tools, such as Lighthouse, only test pages that start with `http://`. If Python is installed:

```bash
cd 202370250-FahadAltuwayjiri-assignment3
python -m http.server 5500
```

Then open <http://localhost:5500> in your browser. In VS Code you can also use the **Live Server** extension.

No installation, build step, or packages are needed.

---

## How to Use the Website

1. **Say hello:** type your first name under "What should I call you?" and press **Save**. The greeting will use your name, even after you close the browser. Click **Change name** to edit it.
2. **Switch the theme:** click **Dark Mode / Light Mode** at the top. Your choice is remembered.
3. **Explore projects:**
   - Choose your experience level (*Beginner* / *Advanced*) to see matching projects and an explanation.
   - Click **All**, **Web**, or **Mobile** to filter by category.
   - Type in the search box to filter while you type.
   - Use **Sort by** to order projects by date or name.
   - If nothing matches, a message tells you to change the search, category, or level.
4. **See my GitHub work:** the repository cards load automatically. If GitHub cannot be reached, read the message and press **Try again**.
5. **Contact me:** fill in your name, email, and a message (at least 10 characters). Errors appear under a field after you leave it. **Send** becomes active only when everything is correct.
6. **Footer:** shows how long you have been on the page.

> The contact form is a demonstration: it does not send the message to a server.

---

## Project Structure

```
202370250-FahadAltuwayjiri-assignment3/
├── README.md
├── index.html                  # page content and sections
├── css/
│   └── styles.css              # layout, colors (CSS variables), dark mode, responsive design
├── js/
│   └── script.js               # all interactive features (9 numbered sections)
├── assets/
│   └── images/                 # WebP screenshots, SVG illustrations, favicon
├── docs/
│   ├── ai-usage-report.md      # how AI was used (with usage log and declaration)
│   └── technical-documentation.md
├── LICENSE
└── .gitignore
```

## Technologies

- HTML5 (semantic sections, accessible forms)
- CSS3 (Flexbox, Grid, custom properties, media queries, animations)
- JavaScript ES2018+ (`async/await`, `fetch`, `AbortController`, `localStorage`, `sessionStorage`, `IntersectionObserver`, `Intl.RelativeTimeFormat`)
- [GitHub REST API](https://docs.github.com/en/rest/repos/repos#list-repositories-for-a-user)

## Performance

| Check | Result |
|-------|--------|
| Lighthouse – Mobile | Performance 100, Accessibility 100, Best Practices 100, SEO 100 |
| Lighthouse – Desktop | Performance 100, Accessibility 100, Best Practices 100, SEO 100 |
| Project images | 576 KB → 46 KB |

Details are in the [technical documentation](docs/technical-documentation.md#7-performance).

---

## AI Use

I used **Claude (Opus 5.5)** in the Claude Code desktop app as a coding assistant. It explained the assignment requirements in Arabic, compared my Assignment 2 code with the new requirements, and wrote the code for each feature one at a time. After every feature I reviewed the change and its explanation, checked the test results in the browser, asked for changes where needed, and only then approved the commit. Commits with AI-assisted code include `Assisted-by: Claude (Opus 5.5)`.

The full details, usage log, and declaration are in the [AI Usage Report](docs/ai-usage-report.md).

## Documentation

- [Technical Documentation](docs/technical-documentation.md)
- [AI Usage Report](docs/ai-usage-report.md)

## Author

**Fahad Altuwayjiri** – Computer Science student, KFUPM (ID 202370250)
GitHub: [@TWFHD](https://github.com/TWFHD)
