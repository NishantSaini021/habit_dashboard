
const themeToggleBtn = document.getElementById('theme-toggle-btn')
const darkModeIcon = document.getElementById('dark-mode-icon')
const lightModeIcon = document.getElementById('light-mode-icon')

themeToggleBtn.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark')
    darkModeIcon.classList.toggle('hidden')
    lightModeIcon.classList.toggle('hidden')
})

 const habitForm = document.querySelector('#habitCreationCard form')

 const habitNameInput = habitForm.querySelector('input[placeholder*="Habit Name"]')
 const habitFrequencyInput = habitForm.querySelector('select')
 const habitGoalInput = habitForm.querySelector('input[placeholder*="Goal"]')
 const habitReminderInput = habitForm.querySelector('input[placeholder*="Reminder"]')

 const todaysHabitsList = document.getElementById('todaysHabits').querySelector('ul')

 const addHabitBtnHero = document.getElementById('addHabitBtnHero')

 function addHabit(event) {
    event.preventDefault()  

     const name = habitNameInput.value.trim()
    const frequency = habitFrequencyInput.value
    const goal = habitGoalInput.value.trim()
    const reminder = habitReminderInput.value

    if (!name) {
        alert("Please enter a habit name!")
        return
    }

     const newHabit = {
        id: Date.now().toString(),  
        name: name,
        frequency: frequency,
        goal: goal,
        reminder: reminder,
        completedDates: []
    }

     const habits = JSON.parse(localStorage.getItem('habits')) || []

     habits.push(newHabit)

     localStorage.setItem('habits', JSON.stringify(habits))

     habitForm.reset()

     renderHabits()
}

 habitForm.addEventListener('submit', addHabit)
 function renderHabits() {
     todaysHabitsList.innerHTML = ''

     const habits = JSON.parse(localStorage.getItem('habits')) || []

     habits.forEach(habit => {
         const li = document.createElement('li')
        li.className = 'habitItem flex items-center justify-between p-4 rounded-md bg-white/30 dark:bg-blue-900/20 hover:bg-white/50 dark:hover:bg-blue-900/40 transition-all duration-300 transform hover:scale-[1.03]'
        li.id = `habit-${habit.id}`  
         const leftDiv = document.createElement('div')
        leftDiv.className = 'flex items-center'

        const checkbox = document.createElement('input')
        checkbox.type = 'checkbox'
        checkbox.className = 'h-6 w-6 rounded text-primary focus:ring-primary-light border-sky-300 dark:border-blue-700 bg-transparent'
        checkbox.checked = habit.completedDates.length > 0 
        checkbox.addEventListener('change', () => toggleHabitComplete(habit.id))

        const label = document.createElement('label')
        label.className = 'ml-4 text-lg text-text-light dark:text-text-dark'
        label.textContent = habit.name

        leftDiv.appendChild(checkbox)
        leftDiv.appendChild(label)

         const rightDiv = document.createElement('div')
        rightDiv.className = 'flex items-center space-x-2 text-sm text-slate-600 dark:text-blue-200'

        const streakIcon = document.createElement('span')
        streakIcon.className = 'material-icons text-secondary-amber text-base'
        streakIcon.textContent = 'local_fire_department'

        const streakText = document.createElement('span')
        streakText.textContent = `Streak: ${habit.completedDates.length} days`

        rightDiv.appendChild(streakIcon)
        rightDiv.appendChild(streakText)

        li.appendChild(leftDiv)
        li.appendChild(rightDiv)

         todaysHabitsList.appendChild(li)
    })
}

 function attachCheckboxListeners() {
    const checkboxes = document.querySelectorAll('#todaysHabits ul input[type="checkbox"]');

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('click', () => {
            const habitId = checkbox.dataset.id;  
            const habits = JSON.parse(localStorage.getItem('habits')) || [];
            const habit = habits.find(h => h.id === habitId);
            const today = new Date().toISOString().split('T')[0];  

            if (!habit) return;

             if (habit.completedDates.includes(today)) {
                habit.completedDates = habit.completedDates.filter(d => d !== today);
            } else {
                habit.completedDates.push(today);
            }

             localStorage.setItem('habits', JSON.stringify(habits));

             const label = checkbox.nextElementSibling;
            if (habit.completedDates.includes(today)) {
                label.classList.add('line-through');
            } else {
                label.classList.remove('line-through');
            }

         });
    });
}

 attachCheckboxListeners();
 const achievement7Day = document.getElementById('achievement-7day'); 
const habits = JSON.parse(localStorage.getItem('habits')) || [];

habits.forEach(habit => {
     if (habit.completedDates.length >= 7) {
        achievement7Day.classList.remove('opacity-50');  
        achievement7Day.classList.add('shadow-soft-glow-dark');  
    }
});
 const achievementPerfectMonth = document.getElementById('achievement-perfect-month');

habits.forEach(habit => {
     const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

     const completedThisMonth = habit.completedDates.filter(dateStr => {
        const date = new Date(dateStr);
        return date >= startOfMonth && date <= today;
    });

     if (completedThisMonth.length >= today.getDate()) {
        achievementPerfectMonth.classList.remove('opacity-50');
        achievementPerfectMonth.classList.add('shadow-soft-glow-dark');
    }
});
 const achievementEarlyBird = document.getElementById('achievement-early-bird');

habits.forEach(habit => {
    const earlyHour = 9;  
    const earlyCompletions = habit.completedDates.filter(dateStr => {
        const date = new Date(dateStr);
        return date.getHours() < earlyHour;
    });

     if (earlyCompletions.length === habit.completedDates.length && habit.completedDates.length > 0) {
        achievementEarlyBird.classList.remove('opacity-50');
        achievementEarlyBird.classList.add('shadow-soft-glow-dark');
    }
});

 const achievementCreator = document.getElementById('achievement-creator');

if (habits.length >= 10) {  
    achievementCreator.classList.remove('opacity-50');
    achievementCreator.classList.add('shadow-soft-glow-dark');
}
