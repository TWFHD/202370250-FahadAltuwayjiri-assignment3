# AI Usage Report – Assignment 3

## 1. Tools Used and Use Cases

| Tool (model) | Where | How I used it |
|--------------|-------|---------------|
| Claude (Opus 5.5) | Claude Code, desktop app (Code tab) | Explaining the requirements, reviewing my Assignment 2 code, writing the code for each feature, testing it in the built-in browser, preparing commits, and drafting the documentation. |

### How the work was organized

1. **Understanding the assignment.** I gave Claude the assignment file and asked it to explain the requirements in Arabic. It summarized each section, the grading rubric, and the AI declaration rules.
2. **Gap analysis.** I shared my Assignment 2 repository. Claude compared it with the new requirements and listed what was already done (GitHub API, filter, dark mode, form checks), what was missing (sorting, level choice, timer, visitor name), and problems (two "SVG" images that were really 576 KB of embedded PNG, duplicated CSS, a weak email check).
3. **Choosing how to work.** Claude asked how I wanted to split the work. I chose **"Claude writes, I review"** and picked the order of the features (sorting first).
4. **One feature at a time.** For each feature Claude wrote the code, explained the important lines in Arabic, and tested it in the browser. I reviewed the explanation and results, and the commit was made only after my approval ("Commit and push").
5. **Clean-up and performance.** Claude reorganized the JavaScript and CSS without changing behaviour, then I ran Lighthouse myself in Chrome.
6. **Documentation.** Claude drafted the README, the technical documentation, and this report. I reviewed them and confirmed the facts before approving.

## 2. Usage Log

| ID | Tool (model) | Date | Purpose | Files affected | What I changed and how I verified it |
|----|--------------|------|---------|----------------|--------------------------------------|
| C01 | Claude (Opus 5.5) | 2026-11-21 | Whole assignment: explain requirements, gap analysis, implement all features, clean-up, documentation | All files below | Single conversation. I chose the working method and feature order, asked for answers in Arabic, created the GitHub repository and moved the project into it, approved every commit, and ran Lighthouse. Details per artifact below. |
| A01 | Claude (Opus 5.5) | 2026-11-21 | Rebuild project images as WebP (Python/Pillow script) | `assets/images/*.webp` | Checked both images visually before they were used; size went from 576 KB to 46 KB. Commit `bd28268`. |
| A02 | Claude (Opus 5.5) | 2026-11-21 | Project sorting + two new project cards | `index.html`, `js/script.js`, `css/styles.css`, `assets/images/portfolio-v*.svg` | Reviewed the `sortProjects()` explanation; checked the sort order in all modes and with the Web filter. Project dates were taken from my project screenshots. Commit `06c9ad9`. |
| A03 | Claude (Opus 5.5) | 2026-11-21 | Beginner / Advanced level choice | `index.html`, `js/script.js`, `css/styles.css` | Checked every level with every category, including the empty result. Commit `0cb514d`. |
| A04 | Claude (Opus 5.5) | 2026-11-21 | Time-on-site timer | `index.html`, `js/script.js`, `css/styles.css` | Checked counting, pausing on a hidden tab, and the hour format. Commit `4cdd61a`. |
| A05 | Claude (Opus 5.5) | 2026-11-21 | Visitor name and visit counter | `index.html`, `js/script.js`, `css/styles.css` | Tested English and Arabic names, invalid names, reload, and changing the name. Two problems found in testing were fixed before the commit (Save button alignment; contact form keeping the old name). Commit `42f1861`. |
| A06 | Claude (Opus 5.5) | 2026-11-21 | Contact form validation | `index.html`, `js/script.js`, `css/styles.css` | Tested valid and invalid emails, short messages, the counter, disabled/enabled Send, and the reset after sending. Commit `46abc5a`. |
| A07 | Claude (Opus 5.5) | 2026-11-21 | GitHub section: async/await, cache, timeout, error messages, retry | `index.html`, `js/script.js`, `css/styles.css` | Tested live data, cache, simulated 403/500 errors, timeout, and Try again. A problem found in testing (old cards staying visible under an error) was fixed. Commit `d1c2976`. |
| A08 | Claude (Opus 5.5) | 2026-11-21 | Code clean-up, CSS variables, theme without flash, meta tags, accessibility | `index.html`, `js/script.js`, `css/styles.css` | Re-tested all features in light, dark, and mobile view. I ran Lighthouse in Chrome: 100 in all categories on mobile and desktop. Commit `0038d6e`. |
| A09 | Claude (Opus 5.5) | 2026-11-21 | Documentation drafts | `README.md`, `docs/technical-documentation.md`, `docs/ai-usage-report.md` | Read all three files, checked that they describe what the site really does, confirmed the project dates, and approved them. |

All commits that contain AI-assisted code end with `Assisted-by: Claude (Opus 5.5)`.

## 3. Benefits and Challenges

### Benefits

- **Clear requirements:** the Arabic explanation and the gap analysis showed me exactly what to build instead of starting from scratch.
- **Problems I did not notice:** Claude found that my project images were 576 KB because they were PNG screenshots inside SVG files, and that my email check accepted addresses like `a@.com`.
- **Testing:** every feature was tested in the browser, including errors that are hard to cause by hand (GitHub rate limit, a slow response).
- **Explanations:** each change came with an explanation of the important lines, which helped me understand concepts such as `AbortController`, `visibilitychange`, and CSS variables.

### Challenges and limitations

- **Too much at once:** at the start Claude began writing many changes together. I stopped it and asked to work together one feature at a time so I could follow and review each step.
- **Language:** one long explanation was written in English, so I asked it to answer in Arabic.
- **Environment problems:** the first working folder had a path that was too long for Windows, and later the files were copied into subfolders of my repository. These had to be fixed before committing.
- **Tool restrictions:** some actions were blocked (a commit before I approved it, and downloading Lighthouse with `npx`), so I ran Lighthouse myself in Chrome.
- **Guessed content:** the project dates were guessed from my screenshots, so I had to check them myself.

## 4. Learning Outcomes

- **Asynchronous JavaScript:** using `async/await` with `try/catch/finally`, and cancelling a slow request with `AbortController`.
- **Error handling for APIs:** giving a different message for each kind of failure (offline, rate limit, timeout) and offering a retry.
- **Caching:** saving API results in `sessionStorage` with a time stamp to avoid GitHub's 60-requests-per-hour limit.
- **Sorting the DOM:** converting a `NodeList` with `Array.from`, sorting with a compare function, and re-ordering elements with `appendChild`.
- **Combining conditions:** showing a card only when the category, level, and search checks are all true.
- **Validation design:** keeping validation rules in an object, showing errors only after a field is touched, and disabling the submit button until the form is valid.
- **Regular expressions:** an email pattern, and `\p{L}` to accept letters from any language.
- **Accurate timers:** calculating elapsed time from `Date.now()` instead of counting with `setInterval`, and pausing with `visibilitychange`.
- **State management:** when to use `localStorage` or `sessionStorage`, converting stored text with `Number()` and `JSON.parse()`, and protecting storage access with `try/catch`.
- **CSS variables:** writing the dark theme by changing variables only, and applying the theme before the first paint.
- **Performance tools:** checking image sizes, using WebP and lazy loading, and testing with Lighthouse.
- **Workflow:** small commits for each feature, and reviewing AI output before accepting it.

## 5. Responsible Use and Modifications

- **I made the decisions:** the working method, the order of the features, when to commit and push, and the final content of the documentation.
- **Review before every commit:** I did not accept any feature without reading its explanation and the test results. Nothing was committed or pushed without my approval.
- **Testing:** each feature was tested in the browser, including error cases and mobile/dark mode, and I ran Lighthouse myself. Problems found during testing were fixed before committing (see A05 and A07).
- **Correct facts:** the projects are my real projects, the GitHub data is loaded live from my real account, and I checked the project details and dates.
- **Transparency:** every AI-assisted commit has an `Assisted-by` line, all AI use is in the usage log above, and the full conversation and the AI's original output are in the evidence ZIP.
- **Understanding:** I can explain every feature in the code; the most important parts are explained in the [technical documentation](technical-documentation.md).

### AI Evidence ZIP

Submitted on Blackboard as `202370250-FahadAltuwayjiri-assignment3-ai-evidence.zip` (not committed to this repository):

- `conversations/` – the full, unedited C01 conversation
- `artifacts/` – the AI's output before my edits (A01–A09)

## 6. Declaration

> I declare that this report and the attached evidence document all of my AI use in this assignment, with complete and unedited conversations, and that I understand and can explain all the code I submitted. I understand that undeclared AI use or a false declaration will be treated as plagiarism according to KFUPM regulations.

**Name:** Fahad Altuwayjiri
**Student ID:** 202370250
**Date:** 2026-11-21
