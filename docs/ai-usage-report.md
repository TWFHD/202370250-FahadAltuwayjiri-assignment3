# AI Usage Report

## Tools Used

| Tool | How I used it |
|------|---------------|
| Claude (Opus 5.5) | Explained the assignment requirements in Arabic, split the work into tasks, gave me the first version of the code for each feature, reviewed my files after each step, and helped write the documentation. |

## Usage Log

| ID | Tool (model) | Date | Purpose | Files affected | What you changed and how you verified it |
|----|--------------|------|---------|----------------|------------------------------------------|
| C01 | Claude (Opus 5.5) | 2026-10-19 – 2026-10-25 | Explain the assignment, plan features, generate code for filter/search, dark mode, form validation, GitHub API, and animations, and write documentation | `index.html`, `css/styles.css`, `js/script.js`, `README.md`, `docs/technical-documentation.md`, `docs/ai-usage-report.md` | I added each feature myself, one step at a time. I chose the project categories (I changed UNIBus to "Mobile" and replaced the "Java" button with a "Mobile" button). I fixed a mistake where I placed the GitHub link outside the menu. I tested every feature in the browser (see the testing table in `technical-documentation.md`) and checked the console for errors. |

### Note About Commits

I forgot to add the `Assisted-by` line to some commit messages. The following commits contain code assisted by Claude (C01):

- Add project filter and live search
- Add dark mode with localStorage
- Add contact form validation and feedback messages
- Load latest repositories from GitHub API
- Add hover effects and fade-in animations

From now on, every AI-assisted commit includes `Assisted-by: Claude (Opus 5.5)`.

## How AI Helped

- **Understanding the assignment:** I asked Claude to explain the requirements in Arabic, which helped me know exactly what to build.
- **Planning:** It split the work into small tasks: filter and search, dark mode, form validation, GitHub API, animations, and documentation.
- **Code:** It gave me simple code for each task with an explanation of the important lines.
- **Review:** After each task I sent my files, and it pointed out mistakes, for example the project cards were missing `data-category`, the filter buttons did not match the categories, and the GitHub link was outside the menu.
- **Documentation:** It helped me write the README and technical documentation.

## What I Changed and Verified

- Chose the categories that match my real projects (Web and Mobile).
- Fixed the mistakes found during review.
- Tested all features in the browser, in both light and dark mode, and on a small screen.

## What I Learned

- How to use `data-` attributes and `dataset` to filter elements.
- How to save user preferences with `localStorage`.
- How to use `fetch()` with `.then()` and `.catch()` to get data from an API and handle errors.
- How to validate a form with JavaScript and show messages under each field.
- How to use `IntersectionObserver` and CSS transitions for simple animations.

## Declaration

> I declare that this report and the attached evidence document all of my AI use in this assignment, with complete and unedited conversations, and that I understand and can explain all the code I submitted. I understand that undeclared AI use or a false declaration will be treated as plagiarism according to KFUPM regulations.

**Name:** Fahad Altuwayjiri
**Student ID:** 202370250
**Date:** 2026-10-25