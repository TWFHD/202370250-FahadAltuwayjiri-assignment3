# Technical Documentation

## Project Description

This is a one-page portfolio website made with HTML, CSS, and JavaScript without any framework. Assignment 2 adds interactive features on top of the Assignment 1 page.

## Files

- `index.html`: the content and sections of the website.
- `css/styles.css`: colors, layout, responsive design, animations, and dark mode.
- `js/script.js`: all the interactive features.
- `assets/images`: profile and project images.
- `docs`: the project documentation.

## Website Sections

1. **Home:** my name, a greeting based on the time, and an image.
2. **About Me:** short introduction, skills, and student information.
3. **Projects:** project cards with filter buttons and a search box.
4. **GitHub:** my latest repositories loaded from the GitHub API.
5. **Contact:** a form with validation.

## JavaScript Features

### 1. Greeting
`new Date().getHours()` gets the current hour, and an `if / else` changes the greeting to morning, afternoon, or evening.

### 2. Project Filter and Search
- Each project card has a `data-category` attribute (`web` or `mobile`).
- Each filter button has a `data-filter` attribute.
- The function `updateProjects()` goes over the cards and shows a card only if:
  - it matches the selected category (or "All" is selected), **and**
  - its text includes what the user typed (both are changed to lowercase first).
- The function runs when a button is clicked and on every `input` event in the search box.
- It counts the visible cards. If the count is 0, the "No projects found" message is shown.
- The CSS rule `.project-card[hidden] { display: none; }` makes sure hidden cards really disappear.
- `aria-pressed` is updated on the buttons so screen readers know which filter is selected.

### 3. Dark Mode with localStorage
- Clicking the button adds or removes the `dark` class on the `<body>` using `classList.toggle()`.
- All dark colors are written in CSS under `body.dark`, so JavaScript only changes one class.
- The choice is saved with `localStorage.setItem("theme", ...)`.
- When the page loads, `localStorage.getItem("theme")` is checked, and dark mode is turned on again if it was saved.

### 4. GitHub API
- `fetch()` sends a request to `https://api.github.com/users/TWFHD/repos?sort=updated&per_page=5`.
- "Loading..." is shown until the data arrives.
- If `response.ok` is false, an error is thrown so the `.catch()` part runs.
- For each repository, a list item with a link is created using `document.createElement()`. I used `textContent` instead of `innerHTML` so the text is not treated as HTML.
- If the list is empty, a "No repositories to show yet" message appears.
- If the request fails (no internet or GitHub limit), a friendly error message tells the user to check the connection and refresh.

### 5. Form Validation
- The form has `novalidate` so the browser's default popups don't appear and my own messages are used instead.
- On submit, `event.preventDefault()` stops the page from reloading.
- Each field is checked:
  - Name must not be empty.
  - Email must not be empty and must contain `@` and `.`.
  - Message must be at least 10 characters.
- An error message appears under each wrong field. Old messages are cleared each time.
- If all fields are valid, a thank-you message with the user's name appears with an animation, and the form is cleared.

### 6. Fade-in on Scroll
- Sections with the `fade-in` class start invisible and a little lower.
- An `IntersectionObserver` checks when a section enters the screen and adds the `visible` class.
- The CSS `transition` makes it fade and slide in smoothly.
- I used `IntersectionObserver` instead of a `scroll` event because it does not run code on every scroll, so it is lighter for the browser.

## Animations and Transitions (CSS)

- Buttons and links change color with `transition`.
- Project cards move up and get a shadow on hover using `transform: translateY()`.
- The success message uses a `@keyframes` animation called `pop-in`.

## Responsive Design

- Flexbox is used for the navigation, hero section, and project controls.
- CSS Grid is used for the project cards.
- A media query at 700px stacks the navigation and hero section and shows the projects in one column.

## Performance

- No libraries or frameworks are used, so the page loads fast.
- Images are SVG files.
- Only 5 repositories are requested from GitHub.
- The script is loaded at the end of the `<body>` so the page content shows first.

## Browser Compatibility

The site uses standard features (`fetch`, `localStorage`, `IntersectionObserver`, CSS Grid, Flexbox) that work in all modern browsers: Chrome, Edge, Firefox, and Safari.

## Testing

| Test | Expected Result |
|------|-----------------|
| Click "Web" | Only Classroom Reservation is shown |
| Click "Mobile" | Only UNIBus is shown |
| Type "bus" in the search | Only UNIBus is shown |
| Type "xyz" in the search | "No projects found" appears |
| Click Dark Mode, then refresh | Page stays in dark mode |
| Open the page with internet | Repositories appear |
| Open the page without internet | Friendly error message appears |
| Submit an empty form | Three error messages appear |
| Enter "abc" as email | Email error appears |
| Submit a correct form | Thank-you message appears and the form is cleared |
| Scroll down the page | Sections fade in |
| Make the browser narrow | Layout changes to one column |

All tests passed, and there were no errors in the browser console.

## Limitations

- The contact form does not send the message to a server. It is only a demonstration.
- The GitHub API allows a limited number of requests per hour without login. If the limit is reached, the error message is shown.