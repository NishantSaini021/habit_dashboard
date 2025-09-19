// =================================================================
// DOM Element Selections
// =================================================================
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const habitForm = document.getElementById('habitCreationForm');
const habitNameInput = document.getElementById('habitNameInput');
const todaysHabitsList = document.getElementById('todaysHabitsList');
const addHabitBtnHero = document.getElementById('addHabitBtnHero');
const congratsPopup = document.getElementById('congratsPopup');
const userAvatar = document.getElementById('user-avatar');

// =================================================================
// Application State & Local Storage
// =================================================================

// Load habits and achievements from localStorage, or use default values
let habits = JSON.parse(localStorage.getItem('habits')) || [];
let achievements = JSON.parse(localStorage.getItem('achievements')) || {
  '7-day-streak': false,
  'perfect-month': false,
  'early-bird': false,
  'master-habits': false,
  'creator': false
};
let weeklyChartInstance = null; // To hold the chart instance

/**
 * Saves the current habits and achievements to localStorage.
 */
function saveData() {
  localStorage.setItem('habits', JSON.stringify(habits));
  localStorage.setItem('achievements', JSON.stringify(achievements));
}

// =================================================================
// Core Habit Management
// =================================================================

/**
 * Renders all habits to the DOM.
 */
function renderHabits() {
  todaysHabitsList.innerHTML = '';
  if (habits.length === 0) {
    todaysHabitsList.innerHTML = `<p class="text-center text-slate-500 dark:text-blue-300">No habits yet. Add one to get started!</p>`;
  }

  habits.forEach(habit => {
    const isCompletedToday = habit.lastCompletedDate === new Date().toISOString().split('T')[0];
    
    const li = document.createElement('li');
    li.className = 'habitItem flex items-center justify-between p-4 rounded-md bg-white/30 dark:bg-blue-900/20 hover:bg-white/50 dark:hover:bg-blue-900/40 transition-all duration-300 transform hover:scale-[1.03]';
    li.id = habit.id;

    li.innerHTML = `
      <div class="flex items-center flex-grow">
        <input id="${habit.id}-checkbox" type="checkbox" class="h-6 w-6 rounded text-primary focus:ring-primary-light border-sky-300 dark:border-blue-700 bg-transparent flex-shrink-0" ${isCompletedToday ? 'checked' : ''}>
        <label for="${habit.id}-checkbox" class="ml-4 text-lg text-text-light dark:text-text-dark ${isCompletedToday ? 'line-through' : ''}">${habit.name}</label>
      </div>
      <div class="flex items-center space-x-4 text-sm text-slate-600 dark:text-blue-200">
        <div class="flex items-center space-x-1">
            <span class="material-icons text-secondary-amber text-base">local_fire_department</span>
            <span>${habit.streak} days</span>
        </div>
        <button class="delete-btn p-1 rounded-full hover:bg-red-200 dark:hover:bg-red-800/50" data-habit-id="${habit.id}" title="Delete Habit">
            <span class="material-icons text-red-500 text-lg">delete_outline</span>
        </button>
      </div>
    `;
    todaysHabitsList.appendChild(li);
  });
  
  // Update other parts of the UI
  updateAnalytics();
  updateAchievements();
  renderWeeklyChart();
}

/**
 * Creates a new habit object and adds it to the state.
 * @param {string} name - The name of the habit.
 */
function addHabit(name) {
  if (!name) return;
  const habit = {
    id: `habit-${Date.now()}`,
    name,
    streak: 0,
    lastCompletedDate: null, // Essential for correct streak tracking
    lastCompletedHour: null
  };
  habits.push(habit);
  saveData();
  renderHabits();
}

/**
 * Deletes a habit based on its ID.
 * @param {string} habitId - The ID of the habit to delete.
 */
function deleteHabit(habitId) {
    if (confirm('Are you sure you want to delete this habit?')) {
        habits = habits.filter(h => h.id !== habitId);
        saveData();
        renderHabits();
    }
}

// =================================================================
// Analytics and Charting
// =================================================================

/**
 * Updates the completion rate and consistency score bars.
 */
function updateAnalytics() {
  const totalHabits = habits.length;
  const completedToday = habits.filter(h => h.lastCompletedDate === new Date().toISOString().split('T')[0]).length;

  // Completion Rate
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
  document.getElementById('completionRateBar').style.width = `${completionRate}%`;
  document.getElementById('completionRateValue').textContent = `${completionRate}%`;

  // Consistency Score (based on average streak length)
  const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0);
  const averageStreak = totalHabits > 0 ? totalStreak / totalHabits : 0;
  const consistencyScore = Math.min(100, Math.round(averageStreak * 10)); // Simple formula for demonstration
  document.getElementById('consistencyScoreBar').style.width = `${consistencyScore}%`;
  document.getElementById('consistencyScoreValue').textContent = `${consistencyScore}%`;
}


/**
 * Renders or updates the weekly summary chart using Chart.js.
 */
function renderWeeklyChart() {
    const ctx = document.getElementById('weeklyChart').getContext('2d');
    const completionsByDay = [0, 0, 0, 0, 0, 0, 0]; // Sun, Mon, Tue, Wed, Thu, Fri, Sat
    
    // This logic needs a history of completions, which we don't store yet.
    // For now, let's use a placeholder based on recent completions.
    // In a real app, you'd store completion dates in an array for each habit.
    habits.forEach(habit => {
        if (habit.lastCompletedDate) {
            const dayIndex = new Date(habit.lastCompletedDate).getDay();
            completionsByDay[dayIndex]++;
        }
    });

    const chartData = {
        labels: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
        datasets: [{
            label: 'Habits Completed',
            data: completionsByDay,
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1,
            borderRadius: 5,
            hoverBackgroundColor: 'rgba(59, 130, 246, 0.8)'
        }]
    };

    if (weeklyChartInstance) {
        weeklyChartInstance.data = chartData;
        weeklyChartInstance.update();
    } else {
        weeklyChartInstance = new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { drawOnChartArea: false }, ticks: { precision: 0 } },
                    x: { grid: { display: false } }
                }
            }
        });
    }
}


// =================================================================
// Achievements
// =================================================================

/**
 * Updates the UI to reflect unlocked achievements.
 */
function updateAchievements() {
  // 7-Day Streak
  if (habits.some(h => h.streak >= 7)) achievements['7-day-streak'] = true;
  // Master of Habits (100-day streak)
  if (habits.some(h => h.streak >= 100)) achievements['master-habits'] = true;
  // Creator (create 5 habits)
  if (habits.length >= 5) achievements['creator'] = true;

  for (const key in achievements) {
    const card = document.getElementById(`achv-${key.replace('_', '-')}`);
    if (achievements[key] && card) {
      card.classList.remove('opacity-50');
      const icon = card.querySelector('span');
      icon.textContent = 'emoji_events'; // Change from lock to trophy
      icon.classList.remove('text-gray-500');
      icon.classList.add('text-yellow-400');
    }
  }
  saveData();
}

// =================================================================
// Event Listeners
// =================================================================

// --- Theme Toggling ---
themeToggleBtn.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
});

// --- Habit Creation Form ---
habitForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = habitNameInput.value.trim();
  addHabit(name);
  habitForm.reset();
});

// --- Hero Button ---
addHabitBtnHero.addEventListener('click', () => {
  document.getElementById('habitCreationCard').scrollIntoView({ behavior: 'smooth' });
  habitNameInput.focus();
});

// --- Habit List Interactions (Completion and Deletion) ---
todaysHabitsList.addEventListener('click', e => {
    // Handle delete button clicks
    if (e.target.closest('.delete-btn')) {
        const habitId = e.target.closest('.delete-btn').dataset.habitId;
        deleteHabit(habitId);
    }

    // Handle checkbox changes
    if (e.target.type === 'checkbox') {
        const habitId = e.target.id.replace('-checkbox', '');
        const habit = habits.find(h => h.id === habitId);
        if (!habit) return;

        const today = new Date().toISOString().split('T')[0];
        const isChecked = e.target.checked;

        if (isChecked) {
            // Only update if it wasn't already completed today
            if (habit.lastCompletedDate !== today) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);

                // If last completion was yesterday, continue streak. Otherwise, reset to 1.
                if (habit.lastCompletedDate === yesterday.toISOString().split('T')[0]) {
                    habit.streak += 1;
                } else {
                    habit.streak = 1;
                }

                habit.lastCompletedDate = today;
                habit.lastCompletedHour = new Date().getHours();
                
                // Show congratulations popup
                congratsPopup.classList.remove('opacity-0', 'pointer-events-none');
                setTimeout(() => congratsPopup.classList.add('opacity-0', 'pointer-events-none'), 2500);

                 // Check for Early Bird achievement
                if (habit.lastCompletedHour < 9) achievements['early-bird'] = true;
            }
        } else {
            // If user unchecks, revert today's completion
            if (habit.lastCompletedDate === today) {
                habit.streak = Math.max(0, habit.streak - 1);
                habit.lastCompletedDate = null; // Revert completion date
                habit.lastCompletedHour = null;
            }
        }
        saveData();
        renderHabits();
    }
});


// =================================================================
// Initial Application Load
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Set theme from localStorage
  if (localStorage.getItem('theme') === 'dark' || 
     (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  // Create and configure the profile modal
  const profileModal = document.createElement('div');
  profileModal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 hidden';
  profileModal.innerHTML = `
    <div class="bg-card-light dark:bg-card-dark p-8 rounded-lg shadow-lg text-center w-80">
      <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Profile</h2>
      <p class="text-gray-700 dark:text-blue-200 mb-6">This feature is coming soon!</p>
      <button class="modern-btn text-white font-bold py-2 px-6 rounded-md" onclick="this.parentElement.parentElement.classList.add('hidden')">Close</button>
    </div>
  `;
  document.body.appendChild(profileModal);
  
  userAvatar.addEventListener('click', () => profileModal.classList.remove('hidden'));
  profileModal.addEventListener('click', (e) => {
    if (e.target === profileModal) profileModal.classList.add('hidden');
  });

  // Initial render of the application
  renderHabits();
});
