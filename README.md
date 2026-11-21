# Fahad Personal Portfolio – Assignment 2

This is my personal portfolio website. In Assignment 1 I built the basic page with HTML and CSS. In Assignment 2 I made it more interactive using JavaScript.

## What's New in Assignment 2

- **Project filter and search:** buttons to show only Web or Mobile projects, and a search box that filters the projects while you type. If nothing matches, a "No projects found" message appears.
- **Dark mode:** a button in the menu switches between light and dark mode. The choice is saved in `localStorage`, so it stays after refreshing the page.
- **GitHub repositories:** my latest repositories are loaded from the GitHub API. "Loading..." is shown first, and a friendly error message is shown if the request fails.
- **Form validation:** the contact form checks the name, email, and message, and shows an error under each wrong field. When everything is correct, an animated thank-you message appears.
- **Animations:** sections fade in while scrolling, project cards move up on hover, and buttons change color smoothly.

## Features From Assignment 1

- About Me section with skills and student info
- Greeting that changes with the time of day
- Responsive layout for desktop, tablet, and mobile

## Technologies Used

- HTML
- CSS
- JavaScript (no frameworks or libraries)
- GitHub REST API

## Project Structure

```
├── README.md
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── script.js
├── assets/
│   └── images/
├── docs/
│   ├── ai-usage-report.md
│   └── technical-documentation.md
└── .gitignore
```

## How to Run the Project

1. Clone the repository:
   ```
   git clone https://github.com/TWFHD/202370250-FahadAltuwayjiri-assignment2.git
   ```
2. Open the project folder.
3. Double-click `index.html` to open it in a web browser (Chrome, Edge, Firefox, or Safari).

No installation is needed. An internet connection is needed only for the GitHub repositories section.

## How to Use the Website

- Click **Dark Mode** in the menu to change the theme.
- In **My Projects**, click a category button or type in the search box.
- Scroll to **My Latest GitHub Repositories** to see my repositories.
- Fill in the **Contact Me** form and click **Send**. If something is missing, a red message tells you what to fix.

## AI Use

I used Claude to explain the assignment, split it into tasks, and suggest the first version of the code for each feature. I added the code step by step, tested every feature in the browser, and made sure I understand how each part works. Full details are in the [AI Usage Report](docs/ai-usage-report.md).

## Documentation

- [AI Usage Report](docs/ai-usage-report.md)
- [Technical Documentation](docs/technical-documentation.md)