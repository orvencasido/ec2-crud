// DOM Elements
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

// Task array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Event Listeners
taskForm.addEventListener('submit', addTask);

// Functions
function addTask(e) {
    e.preventDefault();
    
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(task);
    saveTasks();
    renderTasks();
    taskInput.value = '';
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    saveTasks();
    renderTasks();
}

function editTask(id) {
    const task = tasks.find(task => task.id === id);
    const newText = prompt('Edit task:', task.text);
    
    if (newText !== null && newText.trim() !== '') {
        tasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, text: newText.trim() };
            }
            return task;
        });
        saveTasks();
        renderTasks();
    }
}

function renderTasks() {
    taskList.innerHTML = '';
    
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item flex items-center p-4 bg-gray-50 rounded-lg transition-all duration-200 hover:translate-x-1 ${
            task.completed ? 'bg-green-50' : ''
        }`;
        
        li.innerHTML = `
            <input type="checkbox" class="w-5 h-5 mr-4 cursor-pointer" ${task.completed ? 'checked' : ''}>
            <span class="flex-1 text-gray-800 ${task.completed ? 'line-through text-gray-500' : ''}">${task.text}</span>
            <div class="flex gap-2">
                <button class="btn-edit p-2 text-yellow-500 hover:bg-yellow-50 rounded-lg transition-colors" title="Edit task">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete task">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        // Event listeners for task actions
        const checkbox = li.querySelector('input[type="checkbox"]');
        const editBtn = li.querySelector('.btn-edit');
        const deleteBtn = li.querySelector('.btn-delete');
        
        checkbox.addEventListener('change', () => toggleTask(task.id));
        editBtn.addEventListener('click', () => editTask(task.id));
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
        
        taskList.appendChild(li);
    });
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Initial render
renderTasks(); 