

// ===== Greeting with the visitor's saved name =====
const greeting = document.getElementById("greeting");
const nameForm = document.getElementById("name-form");
const nameInput = document.getElementById("visitor-name");
const nameError = document.getElementById("visitor-name-error");
const changeNameButton = document.getElementById("change-name");

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
  const savedName = localStorage.getItem("visitorName");

  if (savedName) {
    greeting.textContent = getTimeGreeting() + ", " + savedName + "! Welcome to my portfolio.";
    nameForm.hidden = true;
    changeNameButton.hidden = false;
  } else {
    greeting.textContent = getTimeGreeting() + "! Welcome to my portfolio.";
    nameForm.hidden = false;
    changeNameButton.hidden = true;
  }
}

nameForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const name = nameInput.value.trim();

  // letters (English or Arabic) and spaces only, 2 to 20 characters
  if (!/^[\p{L} ]{2,20}$/u.test(name)) {
    nameError.textContent = "Please enter 2 to 20 letters.";
    return;
  }

  // also fill the name in the contact form, but only if the visitor
  // has not typed a different name there
  const contactName = document.getElementById("name");
  const oldName = localStorage.getItem("visitorName") || "";
  if (contactName.value === "" || contactName.value === oldName) {
    contactName.value = name;
  }

  nameError.textContent = "";
  localStorage.setItem("visitorName", name);
  showGreeting();
});

changeNameButton.addEventListener("click", function () {
  nameInput.value = localStorage.getItem("visitorName") || "";
  nameForm.hidden = false;
  changeNameButton.hidden = true;
  nameInput.focus();
});

showGreeting();


// ===== Visit counter (saved in localStorage) =====
const visitMessage = document.getElementById("visit-message");
const visitCount = Number(localStorage.getItem("visitCount") || 0) + 1;
localStorage.setItem("visitCount", visitCount);

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


// ===== Contact form with step-by-step validation =====
// 1. Each field has its own rule that returns an error message ("" = valid).
// 2. A field shows its error only after the visitor leaves it (or presses Send).
// 3. The Send button stays disabled until every field is valid.
// 4. On submit, the form is checked again, then a "Sending..." step is shown.
const contactForm = document.getElementById("contact-form");
const formMessage = document.getElementById("form-message");
const formHint = document.getElementById("form-hint");
const sendButton = document.getElementById("send-button");
const messageCount = document.getElementById("message-count");
const MESSAGE_MIN = 10;
const MESSAGE_MAX = 500;

// a simple email pattern: something@something.something (at least 2 letters at the end)
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const formFields = {
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

// remembers which fields the visitor has already left, so errors
// are not shown while they are still typing for the first time
const touchedFields = {};

function getFieldValue(fieldName) {
  return document.getElementById(fieldName).value.trim();
}

// checks one field and (if it was touched) shows or clears its error
function checkField(fieldName) {
  const input = document.getElementById(fieldName);
  const errorText = formFields[fieldName](getFieldValue(fieldName));

  if (touchedFields[fieldName]) {
    document.getElementById(fieldName + "-error").textContent = errorText;
    input.setAttribute("aria-invalid", errorText !== "");
  }
  return errorText === "";
}

// checks all fields and turns the Send button on or off
function updateFormState() {
  let allValid = true;
  Object.keys(formFields).forEach(function (fieldName) {
    if (!checkField(fieldName)) {
      allValid = false;
    }
  });

  sendButton.disabled = !allValid;
  formHint.hidden = allValid;
  return allValid;
}

function updateMessageCount() {
  const length = document.getElementById("message").value.length;
  messageCount.textContent = length + " / " + MESSAGE_MAX;
  messageCount.classList.toggle("near-limit", length > MESSAGE_MAX - 50);
}

Object.keys(formFields).forEach(function (fieldName) {
  const input = document.getElementById(fieldName);

  input.addEventListener("input", function () {
    formMessage.classList.remove("show");
    if (fieldName === "message") updateMessageCount();
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
  Object.keys(formFields).forEach(function (fieldName) {
    touchedFields[fieldName] = true;
  });
  if (!updateFormState()) return;

  const name = getFieldValue("name");

  // simulate sending (there is no real server)
  sendButton.disabled = true;
  sendButton.textContent = "Sending...";

  setTimeout(function () {
    formMessage.textContent = "Thank you, " + name + "! Your message has been received.";
    formMessage.classList.add("show");
    sendButton.textContent = "Send";

    // start again with an empty form (but keep the saved visitor name)
    contactForm.reset();
    Object.keys(formFields).forEach(function (fieldName) {
      touchedFields[fieldName] = false;
      document.getElementById(fieldName).removeAttribute("aria-invalid");
    });
    document.getElementById("name").value = localStorage.getItem("visitorName") || "";
    updateMessageCount();
    updateFormState();
  }, 1000);
});

// start the contact form with the saved visitor name (if there is one)
document.getElementById("name").value = localStorage.getItem("visitorName") || "";
updateFormState();


document.getElementById("year").textContent = new Date().getFullYear();


// ===== Time on site timer =====
// Counts only the time the visitor is really looking at the page:
// the timer pauses when the tab is hidden and continues when it comes back.
const timerDisplay = document.getElementById("time-on-site");
let savedSeconds = 0;          // time collected before the last pause
let startTime = Date.now();    // when the current visible period started

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
    return savedSeconds; // paused
  }
  return savedSeconds + Math.floor((Date.now() - startTime) / 1000);
}

function updateTimer() {
  timerDisplay.textContent = formatTime(getSecondsOnPage());
}

document.addEventListener("visibilitychange", function () {
  if (document.hidden) {
    // pause: keep the time so far and stop counting
    savedSeconds = getSecondsOnPage();
    startTime = null;
  } else {
    // continue counting from now
    startTime = Date.now();
  }
});

// Date.now() is used instead of adding 1 every second,
// because setInterval can run late and the time would drift.
setInterval(updateTimer, 1000);


const searchInput = document.getElementById("project-search");
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
const noResults = document.getElementById("no-results");
const sortSelect = document.getElementById("project-sort");
const projectList = document.querySelector(".project-list");
const levelRadios = document.querySelectorAll('input[name="level"]');
const levelMessage = document.getElementById("level-message");
let currentFilter = "all";
let currentLevel = "all";

// a different message for each level the visitor can choose
const levelMessages = {
  all: "Showing all my projects. Choose a level to see the projects that match your experience.",
  beginner: "Beginner projects: simple websites made with HTML, CSS, and JavaScript. A good place to start if you are new to web development.",
  advanced: "Advanced projects: bigger team projects with logins, reservations, and saved data. These show more complex work."
};

// ===== Sort projects =====
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

function updateProjects() {
  const searchText = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;

  sortProjects();

  projectCards.forEach(function (card) {
    const matchesFilter = currentFilter === "all" || card.dataset.category === currentFilter;
    const matchesLevel = currentLevel === "all" || card.dataset.level === currentLevel;
    const matchesSearch = card.textContent.toLowerCase().includes(searchText);

    // a card is shown only if it passes all three checks
    const show = matchesFilter && matchesLevel && matchesSearch;

    card.hidden = !show;
    if (show) visibleCount++;
  });

  noResults.hidden = visibleCount > 0;
}

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    filterButtons.forEach(function (b) {
      b.classList.remove("active");
      b.setAttribute("aria-pressed", "false");
    });
    button.classList.add("active");
    button.setAttribute("aria-pressed", "true");
    currentFilter = button.dataset.filter;
    updateProjects();
  });
});

searchInput.addEventListener("input", updateProjects);
sortSelect.addEventListener("change", updateProjects);

// ===== Level choice (Beginner / Advanced) =====
// When the visitor picks a level, change the message and the visible projects.
levelRadios.forEach(function (radio) {
  radio.addEventListener("change", function () {
    currentLevel = radio.value;
    levelMessage.textContent = levelMessages[currentLevel];
    levelMessage.className = "level-message " + currentLevel;
    updateProjects();
  });
});

levelMessage.textContent = levelMessages.all;

// show the projects in the default order (newest first) when the page opens
updateProjects();


// ===== Dark mode (saved in localStorage) =====
const themeButton = document.getElementById("theme-toggle");

// when the page opens, check if the user chose dark mode before
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeButton.textContent = "Light Mode";
}

themeButton.addEventListener("click", function () {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
    themeButton.textContent = "Light Mode";
  } else {
    localStorage.setItem("theme", "light");
    themeButton.textContent = "Dark Mode";
  }
});



const repoList = document.getElementById("repo-list");
const repoStatus = document.getElementById("repo-status");

fetch("https://api.github.com/users/TWFHD/repos?sort=updated&per_page=5")
  .then(function (response) {
    if (!response.ok) {
      throw new Error("Request failed");
    }
    return response.json();
  })
  .then(function (repos) {
    if (repos.length === 0) {
      repoStatus.textContent = "No repositories to show yet.";
      return;
    }

    repoStatus.textContent = "";

    for (let i = 0; i < repos.length; i++) {
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.href = repos[i].html_url;
      link.target = "_blank";
      link.textContent = repos[i].name;
      li.appendChild(link);
      repoList.appendChild(li);
    }
  })
  .catch(function () {
    repoStatus.textContent = "Sorry, the repositories could not be loaded. Please check your internet connection and refresh the page.";
    repoStatus.classList.add("error");
  });







const fadeSections = document.querySelectorAll(".fade-in");

const observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.15 });

fadeSections.forEach(function (section) {
  observer.observe(section);
});