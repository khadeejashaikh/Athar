
//index+quiz js

const icons = {
    leaf: '<path d="M5 20c6 0 12-5 14-15C9 6 4 10 5 20Z"/><path d="M5 20c3-5 7-8 12-11"/>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>',
    hands: '<path d="M7 11V5a2 2 0 0 1 4 0v5"/><path d="M11 10V3a2 2 0 0 1 4 0v8"/><path d="M15 10V5a2 2 0 0 1 4 0v8c0 5-3 8-8 8h-1c-3 0-5-2-7-5l-1-2a2 2 0 0 1 3-2l2 2"/>',
    people: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
    arrow: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    coin: '<circle cx="12" cy="12" r="9"/><path d="M12 7v10M15 9h-4.5a2 2 0 0 0 0 4H13a2 2 0 0 1 0 4H9"/>',
    box: '<path d="m21 8-9 5-9-5"/><path d="M3 8l9-5 9 5v8l-9 5-9-5Z"/><path d="M12 13v8"/>'
};


// this function goes through the elements that have an icon and puts the right svg inside them
function renderIcons(root = document) {
    root.querySelectorAll('[data-icon]').forEach((element) => {
        const size = element.dataset.size || 22;

        element.innerHTML = `
            <svg
                class="icon"
                width="${size}"
                height="${size}"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true">
                ${icons[element.dataset.icon] || icons.leaf}
            </svg>
        `;
    });
}


// these are the default values used when the user has not saved anything yet
const initialState = {
    points: 25,
    profile: null,
    quizCompleted: false
};

let state;

try {
    state = {
        ...initialState,
        ...JSON.parse(localStorage.getItem('athar-data') || '{}')
    };
} catch (error) {
    state = { ...initialState };
}


// this decides which level the user belongs to depending on how many points they have
function getLevel(points) {
    if (points >= 300) {
        return { number: 4, name: 'TREE', next: 400 };
    }

    if (points >= 150) {
        return { number: 3, name: 'BRANCH', next: 300 };
    }

    if (points >= 50) {
        return { number: 2, name: 'SPROUT', next: 150 };
    }

    return { number: 1, name: 'SEED', next: 50 };
}


// updates the page with the current points, level and profile information whenever something changes
function renderState() {
    const level = getLevel(state.points);

    const levelLabel = document.querySelector('#level-label');
    const headerPoints = document.querySelector('#header-points');
    const avatar = document.querySelector('.avatar');
    const journeyLevel = document.querySelector('#journey-level');
    const journeyPoints = document.querySelector('#journey-points');
    const journeyProgress = document.querySelector('#journey-progress');
    const profileSetup = document.querySelector('#profile-setup');
    const journeyCard = document.querySelector('#journey-card');
    const heroCopy = document.querySelector('#hero-copy');
    const atharLevel = document.querySelector('#athar-level');

    if (levelLabel) {
        levelLabel.textContent =
            `LEVEL ${level.number} · ${level.name}`;
    }

    if (headerPoints) {
        headerPoints.textContent =
            `${state.points} POINTS`;
    }

    if (avatar) {
        avatar.textContent =
            state.profile?.name?.charAt(0).toUpperCase() || 'M';
    }

    // updates the new navigation level chip
    if (atharLevel) {
        atharLevel.textContent =
            `LEVEL ${level.number} · ${level.name} ${state.points} POINTS`;
    }

    if (journeyLevel) {
        journeyLevel.textContent =
            level.name.charAt(0) + level.name.slice(1).toLowerCase();
    }

    if (journeyPoints) {
        journeyPoints.textContent =
            `${state.points} / ${level.next} points`;
    }

    if (journeyProgress) {
        journeyProgress.style.width =
            `${Math.min(100, state.points / level.next * 100)}%`;
    }

    if (profileSetup) {
        profileSetup.hidden = Boolean(state.profile);
    }

    if (journeyCard) {
        journeyCard.hidden = !state.profile;
    }

    if (heroCopy) {
        heroCopy.textContent = state.profile
            ? `Welcome back, ${state.profile.name}. Find a meaningful way to give back to your community, and watch your journey grow.`
            : 'Find a meaningful way to give back to your community, and watch your journey grow.';
    }
}


// saves everything to local storage so the points and profile don't disappear after refreshing the page
function saveState() {
    localStorage.setItem('athar-data', JSON.stringify(state));
    renderState();
}

let toastTimer;


// shows a small message at the bottom of the screen and automatically hides it after a few seconds
function showToast(message) {
    const toast = document.querySelector('#toast');
    const toastMessage = document.querySelector('#toast-message');

    if (!toast || !toastMessage) {
        return;
    }

    toastMessage.textContent = message;
    toast.hidden = false;

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.hidden = true;
    }, 2400);
}


// the new navigation does not use the old mobile menu button,
// so this section only runs if a menu button exists
const menuButton = document.querySelector('#menu-button');
const mainNav = document.querySelector('#main-nav');

if (menuButton && mainNav) {
    menuButton.addEventListener('click', () => {
        const open = mainNav.classList.toggle('nav-open');

        menuButton.setAttribute('aria-expanded', String(open));

        const icon = menuButton.querySelector('[data-icon]');

        if (icon) {
            icon.dataset.icon = open ? 'close' : 'menu';
            renderIcons(menuButton);
        }
    });

    mainNav.addEventListener('click', () => {
        mainNav.classList.remove('nav-open');

        menuButton.setAttribute('aria-expanded', 'false');

        const icon = menuButton.querySelector('[data-icon]');

        if (icon) {
            icon.dataset.icon = 'menu';
            renderIcons(menuButton);
        }
    });
}


// when the profile form is submitted, the information is saved and the user gets points for completing it
const profileForm = document.querySelector('#profile-form');

if (profileForm) {
    profileForm.addEventListener('submit', (event) => {
        event.preventDefault();

        state.profile = {
            name: document.querySelector('#profile-name').value.trim(),
            interest: document.querySelector('#profile-interest').value,
            emirate: document.querySelector('#profile-emirate').value,
            time: document.querySelector('#profile-time').value
        };

        state.points += 10;

        saveState();

        showToast('+10 points · Profile completed');
    });
}


// each cause button gives the user a few points when they explore one of the causes
document.querySelectorAll('.explore-cause').forEach((button) => {
    button.addEventListener('click', () => {
        state.points += 5;
        saveState();

        showToast('+5 points · Cause explored');
    });
});


const quizQuestions = [
    [
        'What feels most meaningful to you?',
        [
            'Giving practical help',
            'Supporting quietly',
            'Bringing people together',
            'Learning about new causes'
        ]
    ],
    [
        'How much time do you usually have?',
        [
            'A few focused hours',
            'A few minutes online',
            'Regular weekly time',
            'It changes each week'
        ]
    ],
    [
        'What kind of setting suits you?',
        [
            'Hands-on and active',
            'Private and flexible',
            'Social and local',
            'Open and exploratory'
        ]
    ],
    [
        'Which action sounds best today?',
        [
            'Pack useful items',
            'Read an official guide',
            'Join a community event',
            'Explore three causes'
        ]
    ],
    [
        'What keeps you motivated?',
        [
            'Seeing a task completed',
            'Knowing I helped safely',
            'Shared momentum',
            'Discovering what matters'
        ]
    ]
];

const quizResults = [
    [
        'The Hands-On Helper',
        'You enjoy practical action and seeing a thoughtful task through from beginning to end.'
    ],
    [
        'The Quiet Supporter',
        'You prefer flexible, considered ways to help safely behind the scenes.'
    ],
    [
        'The Community Builder',
        'You create energy by connecting with people and strengthening local relationships.'
    ],
    [
        'The Cause Explorer',
        'Curiosity guides your impact. You enjoy learning before choosing how to help.'
    ]
];

let quizStep = 0;
let quizAnswers = [];


// builds the quiz one question at a time and then shows the result once all questions have been answered
function renderQuiz() {
    const content = document.querySelector('#quiz-content');

    if (!content) {
        return;
    }

    if (quizStep < quizQuestions.length) {
        const [question, answers] = quizQuestions[quizStep];

        content.innerHTML = `
            <div class="quiz-top">
                <div class="logo">
                    <img src="logo.png" alt="ATHAR - Give With Purpose">
                </div>

                <span>
                    ${quizStep + 1} / ${quizQuestions.length}
                </span>
            </div>

            <div class="progress">
                <i style="
                    width:
                    ${(quizStep + 1) / quizQuestions.length * 100}%;
                "></i>
            </div>

            <span class="tiny-label">
                QUESTION ${quizStep + 1}
            </span>

            <h2 id="quiz-title">
                ${question}
            </h2>

            <div class="quiz-answers">
                ${answers.map((answer, index) => `
                    <button
                        type="button"
                        data-answer="${index}">

                        <i>
                            ${String.fromCharCode(65 + index)}
                        </i>

                        ${answer}

                        <span data-icon="arrow"></span>
                    </button>
                `).join('')}
            </div>
        `;

        content.querySelectorAll('[data-answer]').forEach((button) => {
            button.addEventListener('click', () => {
                quizAnswers.push(Number(button.dataset.answer));
                quizStep += 1;

                if (quizStep === quizQuestions.length && !state.quizCompleted) {
                    state.quizCompleted = true;
                    state.points += 15;

                    saveState();

                    showToast('+15 points · Quiz completed');
                }

                renderQuiz();
            });
        });

    } else {
        const resultIndex =
            quizAnswers.reduce((sum, answer) => sum + answer, 0) % quizResults.length;

        const [title, description] = quizResults[resultIndex];

        content.innerHTML = `
            <div class="quiz-result">

                <div class="result-icon">
                    <span
                        data-icon="leaf"
                        data-size="52">
                    </span>
                </div>

                <span class="tiny-label">
                    YOUR GIVER TYPE
                </span>

                <h2 id="quiz-title">
                    ${title}
                </h2>

                <p>
                    ${description}
                    Start small, stay curious,
                    and let your journey grow.
                </p>

                <div class="recommendations">
                    <b>
                        GOOD WAYS TO BEGIN
                    </b>

                    <span>
                        Explore a cause
                    </span>

                    <span>
                        Complete a small act
                    </span>

                    <span>
                        Visit an official resource
                    </span>
                </div>

                <div class="button-row">
                    <a
                        class="btn"
                        href="#featured-causes"
                        id="see-recommendations">

                        See recommendations

                        <span data-icon="arrow"></span>
                    </a>

                    <button
                        class="btn btn-secondary"
                        id="retake-quiz"
                        type="button">

                        Retake Quiz

                        <span data-icon="arrow"></span>
                    </button>
                </div>
            </div>
        `;

        content.querySelector('#retake-quiz').addEventListener('click', () => {
            quizStep = 0;
            quizAnswers = [];
            renderQuiz();
        });

        content.querySelector('#see-recommendations').addEventListener(
            'click',
            closeQuiz
        );
    }

    renderIcons(content);
}


// opens the quiz overlay and stops the main page from scrolling while the quiz is open
function openQuiz() {
    quizStep = 0;
    quizAnswers = [];

    const overlay = document.querySelector('#quiz-overlay');

    if (!overlay) {
        return;
    }

    overlay.hidden = false;
    document.body.style.overflow = 'hidden';

    renderQuiz();
}

function closeQuiz() {
    const overlay = document.querySelector('#quiz-overlay');

    if (!overlay) {
        return;
    }

    overlay.hidden = true;
    document.body.style.overflow = '';
}


const openQuizButton = document.querySelector('#open-quiz');
const closeQuizButton = document.querySelector('#close-quiz');
const quizOverlay = document.querySelector('#quiz-overlay');

if (openQuizButton) {
    openQuizButton.addEventListener('click', openQuiz);
}

if (closeQuizButton) {
    closeQuizButton.addEventListener('click', closeQuiz);
}

if (quizOverlay) {
    quizOverlay.addEventListener('click', (event) => {
        if (event.target.id === 'quiz-overlay') {
            closeQuiz();
        }
    });
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeQuiz();
    }
});


// runs the main functions when the page loads so the icons, saved information and current progress appear correctly
renderIcons();
renderState();
