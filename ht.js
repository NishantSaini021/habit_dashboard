 
const themeToggleBtn = document.getElementById('theme-toggle-btn')
const darkModeIcon = document.getElementById('dark-mode-icon')
const lightModeIcon = document.getElementById('light-mode-icon')

themeToggleBtn.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark')
  darkModeIcon.classList.toggle('hidden')
  lightModeIcon.classList.toggle('hidden')

  const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  localStorage.setItem('theme', theme)
})

window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark')
    darkModeIcon.classList.add('hidden')
    lightModeIcon.classList.remove('hidden')
  } else {
    document.documentElement.classList.remove('dark')
    darkModeIcon.classList.remove('hidden')
    lightModeIcon.classList.add('hidden')
  }
})
 
const habitForm = document.getElementById('habitCreationForm')
const habitNameInput = document.getElementById('habitNameInput')
const habitFrequencyInput = document.getElementById('habitFrequencyInput')
const habitGoalInput = document.getElementById('habitGoalInput')
const habitReminderInput = document.getElementById('habitReminderInput')
const todaysHabitsList = document.getElementById('todaysHabitsList')
const addHabitBtnHero = document.getElementById('addHabitBtnHero')

let habits = JSON.parse(localStorage.getItem('habits')) || []
let achievements = JSON.parse(localStorage.getItem('achievements')) || {
  '7-day-streak': false,
  'perfect-month': false,
  'early-bird': false,
  'master-habits': false,
  'creator': false
}
 
function saveData() {
  localStorage.setItem('habits', JSON.stringify(habits))
  localStorage.setItem('achievements', JSON.stringify(achievements))
}
 
function renderHabits() {
  todaysHabitsList.innerHTML = ''
  habits.forEach(habit => {
    const li = document.createElement('li')
    li.className = 'habitItem flex items-center justify-between p-4 rounded-md bg-white/30 dark:bg-blue-900/20 hover:bg-white/50 dark:hover:bg-blue-900/40 transition-all duration-300 transform hover:scale-[1.03]'
    li.id = habit.id

    li.innerHTML = `
      <div class="flex items-center">
        <input id="${habit.id}-checkbox" type="checkbox" class="h-6 w-6 rounded text-primary focus:ring-primary-light border-sky-300 dark:border-blue-700 bg-transparent" ${habit.completed ? 'checked' : ''}>
        <label for="${habit.id}-checkbox" class="ml-4 text-lg text-text-light dark:text-text-dark ${habit.completed ? 'line-through' : ''}">${habit.name} (${habit.frequency})</label>
      </div>
      <div class="flex items-center space-x-2 text-sm text-slate-600 dark:text-blue-200">
        <span class="material-icons text-secondary-amber text-base">local_fire_department</span>
        <span>Streak: ${habit.streak} days</span>
      </div>
    `
    todaysHabitsList.appendChild(li)
  })
  updateAnalytics()
  updateAchievements()
}
 
function addHabit(name, frequency) {
  const habit = {
    id: `habit-${Date.now()}`,
    name,
    frequency,
    streak: 0,
    completed: false
  }
  habits.push(habit)
  saveData()
  renderHabits()
}
 
habitForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const name = habitNameInput.value.trim()
  const frequency = habitFrequencyInput.value

  if (!name) return alert('Please enter a habit name.')

  addHabit(name, frequency)

  habitNameInput.value = ''
  habitGoalInput.value = ''
  habitReminderInput.value = ''
})
 
addHabitBtnHero.addEventListener('click', () => {
  const name = prompt('Enter habit name:')
  if (!name) return
  addHabit(name, 'Custom')
})
 
todaysHabitsList.addEventListener('change', e => {
  if (e.target.type === 'checkbox') {
    const habitId = e.target.id.replace('-checkbox', '')
    const habit = habits.find(h => h.id === habitId)
    if (!habit) return

    habit.completed = e.target.checked
    if (habit.completed) {
      habit.streak += 1
    } else {
      habit.streak = Math.max(habit.streak - 1, 0)
    }

    saveData()
    renderHabits()
  }
})
 
function updateAnalytics() {
  const totalHabits = habits.length
  const completedHabits = habits.filter(h => h.completed).length

   const completionRate = totalHabits ? Math.round((completedHabits / totalHabits) * 100) : 0
  const completionRateBar = document.getElementById('completionRateBar')
  const completionRateValue = document.getElementById('completionRateValue')
  completionRateBar.style.width = `${completionRate}%`
  completionRateValue.textContent = `${completionRate}%`

   const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0)
  const consistencyScore = totalHabits ? Math.round(totalStreak / (totalHabits * 100) * 100) : 0
  const consistencyScoreBar = document.getElementById('consistencyScoreBar')
  const consistencyScoreValue = document.getElementById('consistencyScoreValue')
  consistencyScoreBar.style.width = `${consistencyScore}%`
  consistencyScoreValue.textContent = `${consistencyScore}%`

   const weeklyBars = ['bar-M','bar-T','bar-W','bar-T2','bar-F','bar-S','bar-S2']
  weeklyBars.forEach(barId => {
    const bar = document.getElementById(barId).children[0]
    const height = Math.floor(Math.random()*7+3)
    bar.style.height = `${height}rem`
  })
}
 
const achievementCards = {
  '7-day-streak': document.getElementById('achv-7day-streak'),
  'perfect-month': document.getElementById('achv-perfect-month'),
  'early-bird': document.getElementById('achv-early-bird'),
  'master-habits': document.getElementById('achv-master-habits'),
  'creator': document.getElementById('achv-creator')
}

 function lockAllAchievements() {
  Object.keys(achievementCards).forEach(key => {
    achievementCards[key].classList.add('opacity-50')
    achievementCards[key].querySelector('span').classList.remove('text-yellow-400','text-yellow-500')
    achievementCards[key].querySelector('span').classList.add('text-gray-500')
  })
}
   const profileModal = document.createElement('div');
  profileModal.id = 'profileModal';
  profileModal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 hidden';
  profileModal.innerHTML = `
    <div class="bg-card-light dark:bg-card-dark p-8 rounded-lg shadow-lg text-center w-80">
      <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Profile Section</h2>
      <p class="text-gray-700 dark:text-blue-200 mb-6">Coming Soon!</p>
      <button id="closeProfileModal" class="modern-btn text-white font-bold py-2 px-6 rounded-md">Close</button>
    </div>
  `;
  document.body.appendChild(profileModal);

  // Show modal on avatar click
  const userAvatar = document.getElementById('user-avatar');
  userAvatar.addEventListener('click', () => {
    profileModal.classList.remove('hidden');
  });

  // Close modal button
  const closeModalBtn = document.getElementById('closeProfileModal');
  closeModalBtn.addEventListener('click', () => {
    profileModal.classList.add('hidden');
  });

  // Close modal on clicking outside content
  profileModal.addEventListener('click', (e) => {
    if (e.target === profileModal) {
      profileModal.classList.add('hidden');
    }
  });
  // Function to get stored value or random if not exist
function getStoredValue(key, max = 100) {
    let value = localStorage.getItem(key);
    if (value === null) {
        value = Math.floor(Math.random() * (max + 1));
        localStorage.setItem(key, value);
    } else {
        value = parseInt(value);
    }
    return value;
}

// Animate Completion Rate Bar
const completionBar = document.getElementById('completionRateBar');
const completionValue = document.getElementById('completionRateValue');
let completionPercent = getStoredValue('completionRate');

completionBar.style.width = '0%';
let compProgress = 0;
const compInterval = setInterval(() => {
    if (compProgress >= completionPercent) clearInterval(compInterval);
    else {
        compProgress++;
        completionBar.style.width = compProgress + '%';
        completionValue.textContent = compProgress + '%';
    }
}, 10);

// Animate Consistency Score Bar
const consistencyBar = document.getElementById('consistencyScoreBar');
const consistencyValue = document.getElementById('consistencyScoreValue');
let consistencyPercent = getStoredValue('consistencyScore');

consistencyBar.style.width = '0%';
let consProgress = 0;
const consInterval = setInterval(() => {
    if (consProgress >= consistencyPercent) clearInterval(consInterval);
    else {
        consProgress++;
        consistencyBar.style.width = consProgress + '%';
        consistencyValue.textContent = consProgress + '%';
    }
}, 10);

// Animate Weekly Summary Bars
const weeklyBars = document.querySelectorAll('#weeklySummaryBars div div');
weeklyBars.forEach((bar, index) => {
    let key = 'weeklyBar' + index;
    let targetHeight = getStoredValue(key, 8) * 16; // 3rem-8rem approx

    bar.style.height = '0px';
    let currentHeight = 0;
    const interval = setInterval(() => {
        if (currentHeight >= targetHeight) clearInterval(interval);
        else {
            currentHeight += 4; // increment
            bar.style.height = currentHeight + 'px';
        }
    }, 20);
});


function updateAchievements() {
  lockAllAchievements()

  // 7-Day  
  if (habits.some(h => h.streak >= 7)) {
    achievements['7-day-streak'] = true
    achievementCards['7-day-streak'].classList.remove('opacity-50')
    achievementCards['7-day-streak'].querySelector('span').classList.remove('text-gray-500')
    achievementCards['7-day-streak'].querySelector('span').classList.add('text-yellow-400')
  }

  // Perfect Month
  if (habits.every(h => h.streak >= 30)) {
    achievements['perfect-month'] = true
    achievementCards['perfect-month'].classList.remove('opacity-50')
    achievementCards['perfect-month'].querySelector('span').classList.remove('text-gray-500')
    achievementCards['perfect-month'].querySelector('span').classList.add('text-yellow-500')
  }

  // Early Bird (completed before 9 AM)
  const now = new Date()
  if (habits.some(h => h.completed && h.lastCompletedHour !== undefined && h.lastCompletedHour < 9)) {
    achievements['early-bird'] = true
    achievementCards['early-bird'].classList.remove('opacity-50')
    achievementCards['early-bird'].querySelector('span').classList.remove('text-gray-500')
    achievementCards['early-bird'].querySelector('span').classList.add('text-yellow-400')
  }

  // Master of Habits (100-day streak)
  if (habits.some(h => h.streak >= 100)) {
    achievements['master-habits'] = true
    achievementCards['master-habits'].classList.remove('opacity-50')
    achievementCards['master-habits'].querySelector('span').classList.remove('text-gray-500')
    achievementCards['master-habits'].querySelector('span').classList.add('text-yellow-400')
  }

  // Creator (create 10 habits)
  if (habits.length >= 10) {
    achievements['creator'] = true
    achievementCards['creator'].classList.remove('opacity-50')
    achievementCards['creator'].querySelector('span').classList.remove('text-gray-500')
    achievementCards['creator'].querySelector('span').classList.add('text-yellow-400')
  }

  saveData()
}
 
renderHabits()
lockAllAchievements()
