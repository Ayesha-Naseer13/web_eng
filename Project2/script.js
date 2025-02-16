class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.searchTerm = '';
        this.selectedPriority = '';
        this.init();
    }

    init() {
        this.bindEvents();
        this.render();
    }

    bindEvents() {
        document.addEventListener('click', e => {
            if (e.target.matches('#addTask')) this.addTask();
            if (e.target.matches('.delete-btn')) this.deleteTask(e);
            if (e.target.matches('.complete-btn')) this.toggleComplete(e);
            if (e.target.matches('#darkModeToggle')) this.toggleDarkMode();
        });

        document.getElementById('searchInput').addEventListener('input', e => {
            this.searchTerm = e.target.value.toLowerCase();
            this.render();
        });

        document.getElementById('prioritySelect').addEventListener('change', e => {
            this.selectedPriority = e.target.value;
            this.render();
        });
    }

    addTask() {
        const input = document.getElementById('taskInput');
        const priority = document.getElementById('prioritySelect').value;
        const name = input.value.trim();

        if (!name) return;

        this.tasks.push({
            id: Date.now(),
            name,
            priority,
            completed: false,
            createdAt: new Date()
        });

        input.value = '';
        this.saveTasks();
        this.render();
    }

    deleteTask(e) {
        const taskId = +e.target.closest('.task-item').dataset.id;
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.saveTasks();
        this.render();
    }

    toggleComplete(e) {
        const taskId = +e.target.closest('.task-item').dataset.id;
        const task = this.tasks.find(task => task.id === taskId);
        task.completed = !task.completed;
        this.saveTasks();
        this.render();
    }

    get filteredTasks() {
        return this.tasks.filter(task => {
            const matchesSearch = task.name.toLowerCase().includes(this.searchTerm);
            const matchesPriority = this.selectedPriority ? 
                task.priority === this.selectedPriority : true;
            return matchesSearch && matchesPriority && !task.completed;
        });
    }

    render() {
        const groupedTasks = this.filteredTasks.reduce((acc, task) => {
            acc[task.priority] = acc[task.priority] || [];
            acc[task.priority].push(task);
            return acc;
        }, {});

        document.querySelectorAll('.priority-column').forEach(column => {
            const priority = column.dataset.priority;
            const tasks = groupedTasks[priority] || [];
            column.innerHTML = `
                <h3>${priority} Priority</h3>
                ${tasks.map(task => this.taskTemplate(task)).join('')}
            `;
        });

        const completedTasks = this.tasks.filter(task => task.completed);
        document.getElementById('completedTasks').innerHTML = 
            completedTasks.map(task => this.taskTemplate(task, true)).join('');

        document.getElementById('taskCount').textContent = 
            this.tasks.reduce((count, task) => count + !task.completed, 0);

        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    taskTemplate(task, isCompleted = false) {
        return `
            <div class="task-item ${isCompleted ? 'completed-task' : ''}" 
                 data-id="${task.id}" data-priority="${task.priority}">
                <span>${task.name}</span>
                <div>
                    ${!isCompleted ? 
                        `<button class="complete-btn">✓</button>` : ''}
                    <button class="delete-btn">🗑️</button>
                </div>
            </div>
        `;
    }

    toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        document.body.setAttribute('data-theme',
            document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
        );
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
}

// Initialize the app
new TaskManager();