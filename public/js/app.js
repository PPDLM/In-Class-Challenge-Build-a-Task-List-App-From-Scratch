document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    // Fetch and render tasks initially
    fetchTasks();

    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = taskInput.value.trim();
        if (title) {
            await addTask(title);
            taskInput.value = '';
        }
    });

    async function fetchTasks() {
        try {
            const response = await fetch('/api/tasks');
            const tasks = await response.json();
            renderTasks(tasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    }

    function renderTasks(tasks) {
        taskList.innerHTML = '';
        if (tasks.length === 0) {
            taskList.innerHTML = '<li class="list-group-item text-center text-muted py-4">No tasks yet. Add one above!</li>';
            return;
        }

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `list-group-item d-flex justify-content-between align-items-center task-item ${task.completed ? 'task-completed bg-light' : ''}`;
            
            // Left side (checkbox + title)
            const titleDiv = document.createElement('div');
            titleDiv.className = 'd-flex align-items-center gap-3 w-75';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'form-check-input mt-0 fs-5';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', () => toggleTask(task.id));

            const titleSpan = document.createElement('span');
            titleSpan.className = 'task-title flex-grow-1';
            titleSpan.textContent = task.title;

            titleDiv.appendChild(checkbox);
            titleDiv.appendChild(titleSpan);

            // Right side (badge + delete button)
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'd-flex align-items-center gap-2';

            if (task.completed) {
                const badge = document.createElement('span');
                badge.className = 'badge bg-success rounded-pill';
                badge.textContent = 'Completed';
                actionsDiv.appendChild(badge);
            }
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-outline-danger btn-sm';
            deleteBtn.innerHTML = '&times;';
            deleteBtn.title = 'Delete task';
            deleteBtn.addEventListener('click', () => deleteTask(task.id));

            actionsDiv.appendChild(deleteBtn);

            li.appendChild(titleDiv);
            li.appendChild(actionsDiv);

            taskList.appendChild(li);
        });
    }

    async function addTask(title) {
        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title })
            });
            if (response.ok) {
                fetchTasks();
            }
        } catch (error) {
            console.error('Error adding task:', error);
        }
    }

    async function toggleTask(id) {
        try {
            const response = await fetch(`/api/tasks/${id}/toggle`, {
                method: 'PUT'
            });
            if (response.ok) {
                fetchTasks();
            }
        } catch (error) {
            console.error('Error toggling task:', error);
        }
    }

    async function deleteTask(id) {
        try {
            const response = await fetch(`/api/tasks/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                fetchTasks();
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    }
});
