let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let userName = "";

const dailyQuests = {
    health: ["Go for a 15-minute walk 🚶‍♂️", "Drink 8 glasses of water 💧", "Do 10 minutes of stretching 🧘‍♀️"],
    finances: ["Save $5 today 💰", "Review your budget 📊", "Avoid unnecessary spending today 💳"],
    relationships: ["Send a sweet message to a loved one 💌", "Call an old friend ☎️", "Express gratitude to someone special 💖"]
};

document.addEventListener("DOMContentLoaded", function () {
    loadTasks();
    loadName();
    generateCalendar();
    
    // Add event listeners for popup buttons
    document.querySelectorAll('.open-popup-btn').forEach(btn => {
        btn.addEventListener('click', () => openPopup(btn.dataset.popup));
    });
});

function saveName() {
    userName = document.getElementById("userName").value;
    localStorage.setItem("userName", userName);
    
    // Show a cute welcome popup if name is entered for the first time
    if (userName && !localStorage.getItem("welcomed")) {
        localStorage.setItem("welcomed", "true");
        showCutePopup("welcome", `Welcome, ${userName}! 💖`, 
            `<div class="popup-message">
                <img src="https://api.placeholder.com/150/150" alt="Welcome" class="popup-image">
                <p>We're so happy you're here! Let's make every day magical together!</p>
                <div class="sparkles-container">
                    <div class="sparkle"></div>
                    <div class="sparkle"></div>
                    <div class="sparkle"></div>
                </div>
            </div>`);
    }
}

function loadName() {
    userName = localStorage.getItem("userName") || "";
    document.getElementById("userName").value = userName;
}

function generateQuest(taskId) {
    const quests = ["Write a love note 💌", "Plan a romantic dinner 🍽️", "Share a hug 🤗", "Listen to a love song 🎶"];
    const randomQuest = quests[Math.floor(Math.random() * quests.length)];
    document.getElementById(taskId).value = randomQuest;
    
    // Show a cute popup when generating a quest
    showCutePopup("quest-generated", "✨ New Quest Generated! ✨", 
        `<div class="popup-message">
            <p>${randomQuest}</p>
            <div class="heart-animation">❤️</div>
        </div>`);
}

function showToDoList() {
    let todoContainer = document.getElementById("todo-list-container");
    let todoList = document.getElementById("todo-list");
    todoList.innerHTML = "";

    let hasItems = false;

    document.querySelectorAll(".time-slot input").forEach(input => {
        if (input.value) {
            hasItems = true;
            let listItem = document.createElement("li");

            let checkboxContainer = document.createElement("label");
            checkboxContainer.classList.add("checkbox-container");

            let checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.addEventListener("change", () => confirmCompletion(checkbox, input.value));

            let checkmark = document.createElement("span");
            checkmark.classList.add("checkmark");

            checkboxContainer.appendChild(checkbox);
            checkboxContainer.appendChild(checkmark);
            listItem.appendChild(checkboxContainer);
            listItem.appendChild(document.createTextNode(input.value));

            todoList.appendChild(listItem);
        }
    });

    todoContainer.classList.remove("hidden");
    
    // Show popup if no tasks are added
    if (!hasItems) {
        showCutePopup("no-tasks", "No Tasks Yet! 🌸", 
            `<div class="popup-message">
                <p>Add some lovely tasks to get started!</p>
                <div class="floating-hearts">
                    <span>💖</span>
                    <span>💕</span>
                    <span>💓</span>
                </div>
            </div>`);
    }
}

function confirmCompletion(checkbox, task) {
    // Create cute popup confirmation instead of using alert
    showCutePopup("confirm-task", "Task Completion 🌟", 
        `<div class="popup-message">
            <p>Did you complete this task?</p>
            <p class="task-text">"${task}"</p>
            <div class="popup-buttons">
                <button class="confirm-yes">Yes! 💖</button>
                <button class="confirm-no">Not yet 🌸</button>
            </div>
        </div>`,
        function() {
            // Add event listeners to the confirmation buttons
            document.querySelector('.confirm-yes').addEventListener('click', function() {
                checkbox.checked = true;
                giveDailyQuest();
                markCalendar();
                closePopup('confirm-task');
            });
            
            document.querySelector('.confirm-no').addEventListener('click', function() {
                checkbox.checked = false;
                closePopup('confirm-task');
            });
        });
}

function giveDailyQuest() {
    let categories = Object.keys(dailyQuests);
    let randomCategory = categories[Math.floor(Math.random() * categories.length)];
    let randomQuest = dailyQuests[randomCategory][Math.floor(Math.random() * dailyQuests[randomCategory].length)];

    // Display daily quest in a cute popup instead of alert
    showCutePopup("daily-quest", "✨ Daily Quest ✨", 
        `<div class="popup-message">
            <div class="category-badge">${randomCategory.toUpperCase()}</div>
            <p class="quest-text">${randomQuest}</p>
            <div class="confetti-animation"></div>
        </div>`);
}

function markCalendar() {
    let today = new Date();
    let todayDate = today.getDate();
    localStorage.setItem(`completed-${todayDate}-${today.getMonth()}-${today.getFullYear()}`, "true");
    generateCalendar();
    
    // Show celebration popup
    showCutePopup("calendar-marked", "Yay! Day Completed! 🎉", 
        `<div class="popup-message">
            <p>You're doing amazing! Keep up the great work!</p>
            <div class="celebration-animation"></div>
        </div>`);
}

function changeMonth(direction) {
    currentMonth += direction;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    generateCalendar();
}

function generateCalendar() {
    let calendarContainer = document.getElementById("calendar-container");
    calendarContainer.innerHTML = "";
    let today = new Date();
    let daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    document.getElementById("calendar-header").innerText = `📅 ${new Date(currentYear, currentMonth).toLocaleString("default", { month: "long" })} ${currentYear}`;

    for (let day = 1; day <= daysInMonth; day++) {
        let dateBox = document.createElement("div");
        dateBox.className = "calendar-day";
        dateBox.innerText = day;

        let thisDate = new Date(currentYear, currentMonth, day);
        if (thisDate < today.setHours(0, 0, 0, 0)) {
            dateBox.classList.add("disabled");
        }

        let savedCompletion = localStorage.getItem(`completed-${day}-${currentMonth}-${currentYear}`);
        if (savedCompletion === "true") {
            dateBox.classList.add("completed");
        }

        calendarContainer.appendChild(dateBox);
    }
}

// Popup management functions
function showCutePopup(id, title, content, callback) {
    // Remove any existing popup with the same id
    removePopup(id);
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.id = `overlay-${id}`;
    
    // Create popup
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.id = `popup-${id}`;
    
    // Create popup header
    const popupHeader = document.createElement('div');
    popupHeader.className = 'popup-header';
    popupHeader.innerHTML = `
        <h2>${title}</h2>
        <div class="close-popup" onclick="closePopup('${id}')">&times;</div>
    `;
    
    // Create popup content
    const popupContent = document.createElement('div');
    popupContent.className = 'popup-content';
    popupContent.innerHTML = content;
    
    // Add decorative elements
    const heartDecoration1 = document.createElement('div');
    heartDecoration1.className = 'heart-decoration';
    heartDecoration1.style.top = '30px';
    heartDecoration1.style.left = '30px';
    
    const heartDecoration2 = document.createElement('div');
    heartDecoration2.className = 'heart-decoration';
    heartDecoration2.style.bottom = '30px';
    heartDecoration2.style.right = '30px';
    
    // Add sparkles
    for (let i = 1; i <= 4; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        popup.appendChild(sparkle);
    }
    
    // Assemble popup
    popup.appendChild(popupHeader);
    popup.appendChild(popupContent);
    popup.appendChild(heartDecoration1);
    popup.appendChild(heartDecoration2);
    
    // Add to document
    document.body.appendChild(overlay);
    document.body.appendChild(popup);
    
    // Add animation class
    setTimeout(() => {
        popup.classList.add('active');
    }, 10);
    
    // Run callback if provided
    if (callback && typeof callback === 'function') {
        callback();
    }
    
    // Auto-close non-confirmation popups after 3 seconds
    if (id !== 'confirm-task' && id !== 'welcome') {
        setTimeout(() => {
            closePopup(id);
        }, 3000);
    }
}

function closePopup(id) {
    const popup = document.getElementById(`popup-${id}`);
    const overlay = document.getElementById(`overlay-${id}`);
    
    if (popup) {
        popup.classList.add('closing');
        setTimeout(() => {
            if (popup.parentNode) {
                popup.parentNode.removeChild(popup);
            }
        }, 300);
    }
    
    if (overlay) {
        overlay.classList.add('closing');
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 300);
    }
}

function removePopup(id) {
    const popup = document.getElementById(`popup-${id}`);
    const overlay = document.getElementById(`overlay-${id}`);
    
    if (popup && popup.parentNode) {
        popup.parentNode.removeChild(popup);
    }
    
    if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
    }
}

// Add some additional popup animations and styles
function loadTasks() {
    // Placeholder for loadTasks function
    // You can implement this based on your needs
}

// Function to open a specific popup by ID
function openPopup(popupId) {
    switch(popupId) {
        case 'help':
            showCutePopup('help', 'Help & Tips 💫', 
                `<div class="popup-message">
                    <h3>Welcome to your Cutesy Planner!</h3>
                    <ul class="cute-list">
                        <li>💖 Add your name to personalize your experience</li>
                        <li>🌸 Create tasks for different times of day</li>
                        <li>✨ Check off tasks when completed</li>
                        <li>🌟 Track your progress on the calendar</li>
                        <li>💕 Earn daily quests for completing tasks</li>
                    </ul>
                </div>`);
            break;
        case 'achievement':
            showCutePopup('achievement', 'Your Achievements 🏆', 
                `<div class="popup-message">
                    <h3>You're doing amazing!</h3>
                    <div class="achievement-stats">
                        <div class="stat">
                            <span class="stat-number">${getCompletedTasksCount()}</span>
                            <span class="stat-label">Tasks Completed</span>
                        </div>
                        <div class="stat">
                            <span class="stat-number">${getStreakCount()}</span>
                            <span class="stat-label">Day Streak</span>
                        </div>
                    </div>
                </div>`);
            break;
    }
}

// Helper functions for stats
function getCompletedTasksCount() {
    // This is a placeholder - implement actual logic based on your storage
    return localStorage.getItem('completedTasksCount') || 0;
}

function getStreakCount() {
    // This is a placeholder - implement actual streak logic
    return localStorage.getItem('streakCount') || 0;
}
