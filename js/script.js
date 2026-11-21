/*
 * Fahad's Portfolio – Assignment 3
 *
 * Sections in this file:
 *   1. Safe storage helper
 *   2. Dark mode
 *   3. Greeting and visitor name
 *   4. Visit counter
 *   5. Projects: level, category, search, and sort
 *   6. GitHub repositories (API)
 *   7. Contact form validation
 *   8. Footer: year and time-on-site timer
 *   9. Fade-in on scroll
 *
 * The script is loaded with "defer", so the HTML is ready when it runs.
 */


// ===== 1. Safe storage helper =====
// Some browsers block storage (for example in private mode or with strict
// privacy settings) and throw an error. These helpers catch that error, so
// the site still works; the visitor's choices are just not remembered.
const storage = {
  get: function (key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  },
  set: function (key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      // storage is blocked: nothing to do
    }
  }
};


// ===== 2. Dark mode =====
// The small script in <head> already applied the saved theme before the page
// was drawn (so there is no white flash). Here we only handle the button.
const root = document.documentElement;
const themeButton = document.getElementById("theme-toggle");

function updateThemeButton() {
  const isDark = root.getAttribute("data-theme") === "dark";
  themeButton.textContent = isDark ? "Light Mode" : "Dark Mode";
  themeButton.setAttribute("aria-pressed", isDark);
}

themeButton.addEventListener("click", function () {
  const newTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", newTheme);
  storage.set("theme", newTheme);
  updateThemeButton();
});

updateThemeButton();


// ===== 3. Greeting and visitor name =====
const greeting = document.getElementById("greeting");
const nameForm = document.getElementById("name-form");
const nameInput = document.getElementById("visitor-name");
const visitorNameError = document.getElementById("visitor-name-error");
const changeNameButton = document.getElementById("change-name");
const contactNameInput = document.getElementById("name");

// letters (English or Arabic) and spaces only, 2 to 20 characters
const VISITOR_NAME_PATTERN = /^[\p{L} ]{2,20}$/u;

// "Good morning", "Good afternoon", or "Good evening" based on the hour
function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) {
    return "Good morning";
  } else if (hour < 18) {
    return "Good afternoon";
  }
  return "Good evening";
}

// Shows the greeting. If a name is saved, the form is hidden
// and a "Change name" button is shown instead.
function showGreeting() {
  const savedName = storage.get("visitorName");

  if (savedName) {
    greeting.textContent = getTimeGreeting() + ", " + savedName + "! Welcome to my portfolio.";
  } else {
    greeting.textContent = getTimeGreeting() + "! Welcome to my portfolio.";
  }
  nameForm.hidden = Boolean(savedName);
  changeNameButton.hidden = !savedName;
}

nameForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const name = nameInput.value.trim();

  if (!VISITOR_NAME_PATTERN.test(name)) {
    visitorNameError.textContent = "Please enter 2 to 20 letters.";
    return;
  }

  // also fill the name in the contact form, but only if the visitor
  // has not typed a different name there
  const oldName = storage.get("visitorName") || "";
  if (contactNameInput.value === "" || contactNameInput.value === oldName) {
    contactNameInput.value = name;
  }

  visitorNameError.textContent = "";
  storage.set("visitorName", name);
  showGreeting();
});

changeNameButton.addEventListener("click", function () {
  nameInput.value = storage.get("visitorName") || "";
  nameForm.hidden = false;
  changeNameButton.hidden = true;
  nameInput.focus();
});

showGreeting();


// ===== 4. Visit counter =====
const visitMessage = document.getElementById("visit-message");
const visitCount = Number(storage.get("visitCount") || 0) + 1;
storage.set("visitCount", visitCount);

// 1 -> "1st", 2 -> "2nd", 3 -> "3rd", 11 -> "11th", 22 -> "22nd"
function toOrdinal(number) {
  const lastTwo = number % 100;
  if (lastTwo >= 11 && lastTwo <= 13) {
    return number + "th";
  }
  const endings = { 1: "st", 2: "nd", 3: "rd" };
  return number + (endings[number % 10] || "th");
}

if (visitCount === 1) {
  visitMessage.textContent = "This is your first visit. Nice to meet you!";
} else {
  visitMessage.textContent = "This is your " + toOrdinal(visitCount) + " visit. Thanks for coming back!";
}


// ===== 5. Projects: level, category, search, and sort =====
const projectList = document.querySelector(".project-list");
const projectCards = document.querySelectorAll(".project-card");
const searchInput = document.getElementById("project-search");
const filterButtons = document.querySelectorAll(".filter-btn");
const sortSelect = document.getElementById("project-sort");
const levelRadios = document.querySelectorAll('input[name="level"]');
const levelMessage = document.getElementById("level-message");
const noResults = document.getElementById("no-results");

let currentFilter = "all";
let currentLevel = "all";

// a different message for each level the visitor can choose
const levelMessages = {
  all: "Showing all my projects. Choose a level to see the projects that match your experience.",
  beginner: "Beginner projects: simple websites made with HTML, CSS, and JavaScript. A good place to start if you are new to web development.",
  advanced: "Advanced projects: bigger team projects with logins, reservations, and saved data. These show more complex work."
};

// Puts the cards in a new order (newest, oldest, or by name)
// by moving each card to the end of the list in the sorted order.
function sortProjects() {
  const sortBy = sortSelect.value;
  const cards = Array.from(projectCards);

  cards.sort(function (a, b) {
    const nameA = a.querySelector("h3").textContent;
    const nameB = b.querySelector("h3").textContent;

    if (sortBy === "name") {
      return nameA.localeCompare(nameB);
    }

    // dates are written as "YYYY-MM", so comparing them as text works
    const dateCompare = a.dataset.date.localeCompare(b.dataset.date);

    // if two projects have the same date, sort them by name
    if (dateCompare === 0) {
      return nameA.localeCompare(nameB);
    }

    return sortBy === "newest" ? -dateCompare : dateCompare;
  });

  cards.forEach(function (card) {
    projectList.appendChild(card);
  });
}

// Sorts the cards, then shows only the ones that pass all three checks.
function updateProjects() {
  const searchText = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;

  sortProjects();

  projectCards.forEach(function (card) {
    const matchesFilter = currentFilter === "all" || card.dataset.category === currentFilter;
    const matchesLevel = currentLevel === "all" || card.dataset.level === currentLevel;
    const matchesSearch = card.textContent.toLowerCase().includes(searchText);
    const show = matchesFilter && matchesLevel && matchesSearch;

    card.hidden = !show;
    if (show) {
      visibleCount++;
    }
  });

  noResults.hidden = visibleCount > 0;
}

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    filterButtons.forEach(function (otherButton) {
      otherButton.classList.remove("active");
      otherButton.setAttribute("aria-pressed", "false");
    });
    button.classList.add("active");
    button.setAttribute("aria-pressed", "true");
    currentFilter = button.dataset.filter;
    updateProjects();
  });
});

// When the visitor picks a level, change the message and the visible projects.
levelRadios.forEach(function (radio) {
  radio.addEventListener("change", function () {
    currentLevel = radio.value;
    levelMessage.textContent = levelMessages[currentLevel];
    levelMessage.className = "level-message " + currentLevel;
    updateProjects();
  });
});

searchInput.addEventListener("input", updateProjects);
sortSelect.addEventListener("change", updateProjects);

levelMessage.textContent = levelMessages.all;
updateProjects();


// ===== 6. GitHub repositories (GitHub REST API) =====
// Steps: 1) use the saved copy if it is fresh, 2) otherwise fetch from GitHub
// with a time limit, 3) show the repositories, or a clear error with "Try again".
const GITHUB_USER = "TWFHD";
const REPOS_URL = "https://api.github.com/users/" + GITHUB_USER + "/repos?sort=updated&per_page=10";
const REPOS_CACHE_KEY = "githubRepos";
const CACHE_MINUTES = 10;      // GitHub allows only 60 requests per hour without login
const REQUEST_TIMEOUT = 8000;  // stop waiting after 8 seconds
const MAX_REPOS = 6;

const repoList = document.getElementById("repo-list");
const repoStatus = document.getElementById("repo-status");
const repoRetry = document.getElementById("repo-retry");

// returns the saved repositories if they are newer than CACHE_MINUTES, otherwise null
function getCachedRepos() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(REPOS_CACHE_KEY));
    if (saved && Date.now() - saved.time < CACHE_MINUTES * 60 * 1000) {
      return saved.repos;
    }
  } catch (error) {
    // storage blocked or saved data broken: just load from GitHub
  }
  return null;
}

function saveReposToCache(repos) {
  try {
    sessionStorage.setItem(REPOS_CACHE_KEY, JSON.stringify({ time: Date.now(), repos: repos }));
  } catch (error) {
    // storage blocked: the page still works without the cache
  }
}

// "3 days ago", "last month", ... using the browser's built-in formatter
function timeAgo(dateText) {
  const seconds = (new Date(dateText) - Date.now()) / 1000;
  const units = [["year", 31536000], ["month", 2592000], ["day", 86400], ["hour", 3600], ["minute", 60]];
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  for (const [unit, unitSeconds] of units) {
    if (Math.abs(seconds) >= unitSeconds) {
      return formatter.format(Math.round(seconds / unitSeconds), unit);
    }
  }
  return "just now";
}

// builds one repository card (textContent is used so the data is never treated as HTML)
function createRepoItem(repo) {
  const item = document.createElement("li");

  const link = document.createElement("a");
  link.href = repo.html_url;
  link.target = "_blank";
  link.rel = "noopener";
  link.textContent = repo.name;

  const description = document.createElement("p");
  description.className = "repo-description";
  description.textContent = repo.description || "No description yet.";

  const details = [];
  if (repo.language) {
    details.push(repo.language);
  }
  details.push("★ " + repo.stargazers_count);
  details.push("Updated " + timeAgo(repo.pushed_at));

  const meta = document.createElement("p");
  meta.className = "repo-meta";
  meta.textContent = details.join("  •  ");

  item.append(link, description, meta);
  return item;
}

function showRepos(repos) {
  // forks are other people's projects, so they are not shown
  const ownRepos = repos.filter(function (repo) {
    return !repo.fork;
  }).slice(0, MAX_REPOS);

  repoList.innerHTML = "";

  if (ownRepos.length === 0) {
    repoStatus.textContent = "No repositories to show yet.";
    return;
  }

  repoStatus.textContent = "Showing my " + ownRepos.length + " most recently updated repositories.";
  ownRepos.forEach(function (repo) {
    repoList.appendChild(createRepoItem(repo));
  });
}

// picks a helpful message for each kind of problem
function getErrorMessage(error) {
  if (!navigator.onLine) {
    return "You seem to be offline. Please check your internet connection.";
  }
  if (error.name === "AbortError") {
    return "GitHub is taking too long to answer. Please try again.";
  }
  if (error.status === 403 || error.status === 429) {
    return "GitHub's request limit was reached. Please try again in a few minutes.";
  }
  return "Sorry, the repositories could not be loaded right now.";
}

async function loadRepos() {
  repoRetry.hidden = true;
  repoStatus.classList.remove("error");

  const cached = getCachedRepos();
  if (cached) {
    showRepos(cached);
    return;
  }

  repoStatus.textContent = "Loading repositories...";

  // AbortController cancels the request if it takes longer than REQUEST_TIMEOUT
  const controller = new AbortController();
  const timer = setTimeout(function () {
    controller.abort();
  }, REQUEST_TIMEOUT);

  try {
    const response = await fetch(REPOS_URL, { signal: controller.signal });
    if (!response.ok) {
      const error = new Error("GitHub request failed");
      error.status = response.status;
      throw error;
    }

    const repos = await response.json();
    saveReposToCache(repos);
    showRepos(repos);
  } catch (error) {
    repoList.innerHTML = "";
    repoStatus.textContent = getErrorMessage(error);
    repoStatus.classList.add("error");
    repoRetry.hidden = false;
  } finally {
    clearTimeout(timer);
  }
}

repoRetry.addEventListener("click", loadRepos);
loadRepos();


// ===== 7. Contact form validation =====
// 1. Each field has its own rule that returns an error message ("" = valid).
// 2. A field shows its error only after the visitor leaves it (or presses Send).
// 3. The Send button stays disabled until every field is valid.
// 4. On submit, the form is checked again, then a "Sending..." step is shown.
const contactForm = document.getElementById("contact-form");
const formMessage = document.getElementById("form-message");
const formHint = document.getElementById("form-hint");
const sendButton = document.getElementById("send-button");
const messageInput = document.getElementById("message");
const messageCount = document.getElementById("message-count");

const MESSAGE_MIN = 10;
const MESSAGE_MAX = 500;
const SENDING_DELAY = 1000;

// a simple email pattern: something@something.something (at least 2 letters at the end)
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const formRules = {
  name: function (value) {
    if (value === "") return "Please enter your name.";
    if (value.length < 2) return "Your name should be at least 2 characters.";
    return "";
  },
  email: function (value) {
    if (value === "") return "Please enter your email.";
    if (!EMAIL_PATTERN.test(value)) return "Please enter a valid email, like name@example.com.";
    return "";
  },
  message: function (value) {
    if (value === "") return "Please write a message.";
    if (value.length < MESSAGE_MIN) {
      return "Your message needs " + (MESSAGE_MIN - value.length) + " more characters.";
    }
    return "";
  }
};
const fieldNames = Object.keys(formRules);

// remembers which fields the visitor has already left, so errors
// are not shown while they are still typing for the first time
const touchedFields = {};

// checks one field and (if it was touched) shows or clears its error
function checkField(fieldName) {
  const input = document.getElementById(fieldName);
  const errorText = formRules[fieldName](input.value.trim());

  if (touchedFields[fieldName]) {
    document.getElementById(fieldName + "-error").textContent = errorText;
    input.setAttribute("aria-invalid", errorText !== "");
  }
  return errorText === "";
}

// checks all fields and turns the Send button on or off
function updateFormState() {
  let allValid = true;
  fieldNames.forEach(function (fieldName) {
    if (!checkField(fieldName)) {
      allValid = false;
    }
  });

  sendButton.disabled = !allValid;
  formHint.hidden = allValid;
  return allValid;
}

function updateMessageCount() {
  const length = messageInput.value.length;
  messageCount.textContent = length + " / " + MESSAGE_MAX;
  messageCount.classList.toggle("near-limit", length > MESSAGE_MAX - 50);
}

// clears the form but keeps the saved visitor name
function resetContactForm() {
  contactForm.reset();
  fieldNames.forEach(function (fieldName) {
    touchedFields[fieldName] = false;
    document.getElementById(fieldName).removeAttribute("aria-invalid");
  });
  contactNameInput.value = storage.get("visitorName") || "";
  updateMessageCount();
  updateFormState();
}

fieldNames.forEach(function (fieldName) {
  const input = document.getElementById(fieldName);

  input.addEventListener("input", function () {
    formMessage.classList.remove("show");
    if (fieldName === "message") {
      updateMessageCount();
    }
    updateFormState();
  });

  input.addEventListener("blur", function () {
    touchedFields[fieldName] = true;
    updateFormState();
  });
});

contactForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // show every error, then check again before sending
  fieldNames.forEach(function (fieldName) {
    touchedFields[fieldName] = true;
  });
  if (!updateFormState()) {
    return;
  }

  const name = contactNameInput.value.trim();

  // simulate sending (there is no real server)
  sendButton.disabled = true;
  sendButton.textContent = "Sending...";

  setTimeout(function () {
    formMessage.textContent = "Thank you, " + name + "! Your message has been received.";
    formMessage.classList.add("show");
    sendButton.textContent = "Send";
    resetContactForm();
  }, SENDING_DELAY);
});

resetContactForm();


// ===== 8. Footer: year and time-on-site timer =====
document.getElementById("year").textContent = new Date().getFullYear();

// Counts only the time the visitor is really looking at the page:
// the timer pauses when the tab is hidden and continues when it comes back.
const timerDisplay = document.getElementById("time-on-site");
let savedSeconds = 0;          // time collected before the last pause
let startTime = Date.now();    // when the current visible period started (null = paused)

// turns a number of seconds into "MM:SS" or "H:MM:SS"
function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  if (hours > 0) {
    return hours + ":" + mm + ":" + ss;
  }
  return mm + ":" + ss;
}

function getSecondsOnPage() {
  if (startTime === null) {
    return savedSeconds;
  }
  return savedSeconds + Math.floor((Date.now() - startTime) / 1000);
}

document.addEventListener("visibilitychange", function () {
  if (document.hidden) {
    savedSeconds = getSecondsOnPage();
    startTime = null;
  } else {
    startTime = Date.now();
  }
});

// Date.now() is used instead of adding 1 every second,
// because setInterval can run late and the time would drift.
setInterval(function () {
  timerDisplay.textContent = formatTime(getSecondsOnPage());
}, 1000);


// ===== 9. Fade-in on scroll =====
// IntersectionObserver tells us when a section enters the screen,
// which is lighter than running code on every scroll event.
const fadeSections = document.querySelectorAll(".fade-in");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // each section only needs to fade in once
      }
    });
  }, { threshold: 0.15 });

  fadeSections.forEach(function (section) {
    observer.observe(section);
  });
} else {
  // very old browsers: just show everything
  fadeSections.forEach(function (section) {
    section.classList.add("visible");
  });
}
