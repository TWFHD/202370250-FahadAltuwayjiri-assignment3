

const hour = new Date().getHours();
const greeting = document.getElementById("greeting");

if (hour < 12) {
  greeting.textContent = "Good morning! Welcome to my portfolio.";
} else if (hour < 18) {
  greeting.textContent = "Good afternoon! Welcome to my portfolio.";
} else {
  greeting.textContent = "Good evening! Welcome to my portfolio.";
}


const contactForm = document.getElementById("contact-form");
const formMessage = document.getElementById("form-message");

contactForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  const nameError = document.getElementById("name-error");
  const emailError = document.getElementById("email-error");
  const messageError = document.getElementById("message-error");

  nameError.textContent = "";
  emailError.textContent = "";
  messageError.textContent = "";
  formMessage.textContent = "";
  formMessage.classList.remove("show");

  let valid = true;

  if (name === "") {
    nameError.textContent = "Please enter your name.";
    valid = false;
  }

  if (email === "") {
    emailError.textContent = "Please enter your email.";
    valid = false;
  } else if (!email.includes("@") || !email.includes(".")) {
    emailError.textContent = "Please enter a valid email, like name@example.com.";
    valid = false;
  }

  if (message.length < 10) {
    messageError.textContent = "Your message should be at least 10 characters.";
    valid = false;
  }

  if (valid) {
    formMessage.textContent = "Thank you, " + name + "! Your message has been received.";
    formMessage.classList.add("show");
    contactForm.reset();
  }
});


document.getElementById("year").textContent = new Date().getFullYear();


const searchInput = document.getElementById("project-search");
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
const noResults = document.getElementById("no-results");
let currentFilter = "all";

function updateProjects() {
  const searchText = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;

  projectCards.forEach(function (card) {
    const matchesFilter = currentFilter === "all" || card.dataset.category === currentFilter;
    const matchesSearch = card.textContent.toLowerCase().includes(searchText);
    const show = matchesFilter && matchesSearch;

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