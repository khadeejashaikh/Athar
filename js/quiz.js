// this handles the icons used around the page so we don't have to repeat the svg every time
var icons = {
    leaf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 4C12 4 5 8 5 15c0 3 2 5 5 5 7 0 10-8 10-16Z"/><path d="M4 20c3-5 7-8 13-10"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.8 8.7c0 5.5-8.8 10.3-8.8 10.3S3.2 14.2 3.2 8.7A4.7 4.7 0 0 1 12 6.4a4.7 4.7 0 0 1 8.8 2.3Z"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22V5.5Z"/><path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20"/></svg>',
    hands: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20c-1.8-2-7-5.5-7-9.5C5 7.8 6.8 6 9 6c1.5 0 2.5.8 3 1.8C12.5 6.8 13.5 6 15 6c2.2 0 4 1.8 4 4.5 0 4-5.2 7.5-7 9.5Z"/><path d="M8 12h8"/></svg>',
    people: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3.5 19c.5-3.5 2.5-5 5.5-5s5 1.5 5.5 5"/><path d="M14 14.5c2.8-.2 5 1.2 5.5 4.5"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 12h13"/><path d="m13 6 6 6-6 6"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3 20 6v5c0 5-3.3 8.5-8 10-4.7-1.5-8-5-8-10V6l8-3Z"/><path d="m8.5 12 2.2 2.2 4.8-5"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m6 6 12 12M18 6 6 18"/></svg>',
    coin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8"/><path d="M12 7v10M9.5 9.5c.5-1 4-1 4.5.5.5 1.5-4 1-4 2.5s4 1 4 2.5c0 1.5-4 1.5-4.5.5"/></svg>',
    box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m4 8 8-4 8 4-8 4-8-4Z"/><path d="M4 8v9l8 4 8-4V8"/><path d="M12 12v9"/></svg>'
};

function renderIcons() {
    document.querySelectorAll("[data-icon]").forEach(function (el) {
        var name = el.getAttribute("data-icon");

        if (icons[name]) {
            el.innerHTML = icons[name];
        }
    });
}


// update the home page using the shared points and level data from ATHER.js
function updateHomeLevel() {
    var data = getData();
    var info = getLevelInfo(data.points);

    var levelLabel = document.getElementById("level-label");
    var headerPoints = document.getElementById("header-points");
    var journeyLevel = document.getElementById("journey-level");
    var journeyPoints = document.getElementById("journey-points");
    var journeyProgress = document.getElementById("journey-progress");

    if (levelLabel) {
        levelLabel.textContent = "LEVEL " + (info.index + 1) + " · " + info.name.toUpperCase();
    }

    if (headerPoints) {
        headerPoints.textContent = data.points + " POINTS";
    }

    if (journeyLevel) {
        journeyLevel.textContent = info.name;
    }

    if (journeyPoints) {
        journeyPoints.textContent = data.points + " / " + info.next + " points";
    }

    if (journeyProgress) {
        journeyProgress.style.width = info.progress + "%";
    }
}


// save the profile and give the user points only the first time they complete it
function setupProfile() {
    var form = document.getElementById("profile-form");

    if (!form) {
        return;
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        var data = getData();

        data.profile = {
            name: document.getElementById("profile-name").value,
            interest: document.getElementById("profile-interest").value,
            emirate: document.getElementById("profile-emirate").value,
            time: document.getElementById("profile-time").value
        };

        saveData(data);

        awardOnce("profile-completed", 10);

        document.getElementById("profile-setup").hidden = true;
        document.getElementById("journey-card").hidden = false;

        updateHomeLevel();

        showToast("Profile created! +10 points");
    });
}


// each cause only gives points once, so clicking the same button again won't keep adding points
function setupCauses() {
    document.querySelectorAll(".explore-cause").forEach(function (button) {
        button.addEventListener("click", function () {
            var cause = button.getAttribute("data-cause");

            if (cause) {
                markExplored(cause);
                updateHomeLevel();
            }
        });
    });
}


// this is the quiz that belongs only to the home page and gives one reward when completed
var quizQuestions = [
    {
        question: "What kind of giving feels most natural to you?",
        answers: [
            "Helping people directly",
            "Supporting a cause quietly",
            "Bringing people together",
            "Learning about different causes"
        ]
    },
    {
        question: "How would you rather make an impact?",
        answers: [
            "Giving my time",
            "Giving financial support",
            "Helping my community",
            "Sharing useful information"
        ]
    },
    {
        question: "What would you enjoy doing most?",
        answers: [
            "Volunteering",
            "Supporting trusted organizations",
            "Organizing something with others",
            "Finding new causes to explore"
        ]
    },
    {
        question: "What matters most when choosing a cause?",
        answers: [
            "Seeing direct results",
            "Knowing my support is useful",
            "Helping people around me",
            "Understanding the cause first"
        ]
    },
    {
        question: "Which description fits you best?",
        answers: [
            "I like getting involved",
            "I prefer supporting from behind the scenes",
            "I enjoy working with people",
            "I like discovering new things"
        ]
    }
];

var quizResults = [
    "Hands-On Helper",
    "Quiet Supporter",
    "Community Builder",
    "Cause Explorer"
];

var quizAnswers = [];
var currentQuestion = 0;


// build the quiz screen each time it opens so the user can start from the beginning
function renderQuiz() {
    var content = document.getElementById("quiz-content");

    if (!content) {
        return;
    }

    if (currentQuestion >= quizQuestions.length) {
        showQuizResult();
        return;
    }

    var q = quizQuestions[currentQuestion];

    var html = "";

    html += '<div class="quiz-header">';
    html += '<span class="tiny-label">GIVER QUIZ</span>';
    html += '<h2 id="quiz-title">' + q.question + "</h2>";
    html += "<p>Question " + (currentQuestion + 1) + " of " + quizQuestions.length + "</p>";
    html += "</div>";

    html += '<div class="quiz-answers">';

    q.answers.forEach(function (answer, index) {
        html += '<button type="button" class="quiz-answer" data-answer="' + index + '">';
        html += answer;
        html += '<span data-icon="arrow"></span>';
        html += "</button>";
    });

    html += "</div>";

    content.innerHTML = html;

    renderIcons();

    document.querySelectorAll(".quiz-answer").forEach(function (button) {
        button.addEventListener("click", function () {
            quizAnswers[currentQuestion] = Number(button.getAttribute("data-answer"));
            currentQuestion++;
            renderQuiz();
        });
    });
}


// calculate the result based on the answers instead of just using the last answer
function showQuizResult() {
    var content = document.getElementById("quiz-content");

    var scores = [0, 0, 0, 0];

    quizAnswers.forEach(function (answer) {
        if (answer !== undefined) {
            scores[answer]++;
        }
    });

    var resultIndex = 0;

    for (var i = 1; i < scores.length; i++) {
        if (scores[i] > scores[resultIndex]) {
            resultIndex = i;
        }
    }

    var result = quizResults[resultIndex];

    content.innerHTML =
        '<div class="quiz-header">' +
        '<span class="tiny-label">YOUR RESULT</span>' +
        '<h2>' + result + "</h2>" +
        "<p>Based on your answers, this is the giving style that matches you most.</p>" +
        "</div>" +
        '<div class="quiz-result">' +
        "<p>Keep exploring different ways to give and find what works best for you.</p>" +
        '<button type="button" class="btn" id="finish-quiz">Finish Quiz <span data-icon="arrow"></span></button>' +
        "</div>";

    renderIcons();

    document.getElementById("finish-quiz").addEventListener("click", function () {
        awardOnce("giver-quiz", 15);
        updateHomeLevel();
        closeQuiz();

        showToast("Quiz completed! +15 points");
    });
}


// open and close the quiz without letting the page scroll behind it
function openQuiz() {
    var overlay = document.getElementById("quiz-overlay");

    if (!overlay) {
        return;
    }

    currentQuestion = 0;
    quizAnswers = [];

    overlay.hidden = false;
    document.body.style.overflow = "hidden";

    renderQuiz();
}

function closeQuiz() {
    var overlay = document.getElementById("quiz-overlay");

    if (!overlay) {
        return;
    }

    overlay.hidden = true;
    document.body.style.overflow = "";
}

function setupQuiz() {
    var openButton = document.getElementById("open-quiz");
    var closeButton = document.getElementById("close-quiz");

    if (openButton) {
        openButton.addEventListener("click", openQuiz);
    }

    if (closeButton) {
        closeButton.addEventListener("click", closeQuiz);
    }

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            closeQuiz();
        }
    });
}


function setupMobileMenu() {
    var button = document.getElementById("menu-button");
    var nav = document.getElementById("main-nav");

    if (!button || !nav) {
        return;
    }

    button.addEventListener("click", function () {
        var open = nav.classList.toggle("open");

        button.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            nav.classList.remove("open");
            button.setAttribute("aria-expanded", "false");
        });
    });
}


document.addEventListener("DOMContentLoaded", function () {
    renderIcons();
    updateHomeLevel();
    setupProfile();
    setupCauses();
    setupQuiz();
    setupMobileMenu();

    var data = getData();

    if (data.profile) {
        document.getElementById("profile-setup").hidden = true;
        document.getElementById("journey-card").hidden = false;
    }

    updateHomeLevel();
});
