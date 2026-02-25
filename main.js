import { supabase } from './supabaseClient';
import { AuthService } from './AuthService';
import { TaskService } from './TaskService';
import { StorageService } from './StorageService';

const app = {
    user: null,
    isAdmin: false,
    adminEmail: 'paulagrueso@gmail.com', 

    handleLogin: async () => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const btn = document.getElementById('login-btn');
        if (!email || !password) return alert("Rellena los campos");

        btn.innerText = "Verificando...";
        btn.disabled = true;

        try {
            const user = await AuthService.login(email, password);
            app.user = user;
            app.showApp();
        } catch (err) {
            try {
                await AuthService.signUp(email, password);
                alert("Usuario registrado. Pulsa entrar de nuevo.");
            } catch (sErr) {
                alert("Error: " + sErr.message);
            }
        } finally {
            btn.innerText = "Entrar / Registrarse";
            btn.disabled = false;
        }
    },

    addTask: async () => {
        const titleInput = document.getElementById('task-title');
        const fileInput = document.getElementById('task-file');
        const btn = document.getElementById('add-btn');

        if (!titleInput.value) return alert("Escribe un título");

        btn.innerText = "Guardando...";
        btn.disabled = true;

        try {
            let fileUrl = null;
            if (fileInput.files[0]) {
                fileUrl = await StorageService.uploadFile('attachments', fileInput.files[0], app.user.id);
            }
            await TaskService.create(titleInput.value, app.user.id, fileUrl);
            titleInput.value = '';
            fileInput.value = '';
            app.loadTasks();
        } catch (err) {
            alert("Error: " + err.message);
        } finally {
            btn.innerText = "Añadir Tarea";
            btn.disabled = false;
        }
    },

    loadTasks: async () => {
        try {
            const tasks = await TaskService.getAll();
            app.renderTaskList(tasks, false);
        } catch (err) {
            console.error("Error cargando tareas:", err);
        }
    },

    loadAllTasksAdmin: async () => {
        try {
            const tasks = await TaskService.getAllAdmin();
            app.renderTaskList(tasks, true);
        } catch (err) {
            alert("Error de permisos: Revisa el SQL de RLS en Supabase.");
        }
    },

    renderTaskList: (tasks, isAdminView) => {
        const list = document.getElementById('task-list');
        list.innerHTML = tasks.map(t => `
            <li style="${isAdminView ? 'border-left: 4px solid #7209b7;' : ''}">
                <div style="overflow: hidden;">
                    <span class="task-title">${t.title}</span>
                    ${isAdminView ? `<span class="task-user">Usuario: ${t.user_id.substring(0,8)}...</span>` : ''}
                </div>
                <div class="actions">
                    ${t.file_url ? `<a href="${t.file_url}" target="_blank" class="file-icon">📎</a>` : ''}
                    <button class="btn-icon" onclick="app.editTask('${t.id}', '${t.title.replace(/'/g, "\\'")}')" 
                            style="background:#f39c12;">✏️</button>
                    <button class="btn-icon" onclick="app.deleteTask('${t.id}')" 
                            style="background:var(--danger);">✕</button>
                </div>
            </li>
        `).join('');
    },

    checkAdmin: function() {
        if (this.user && this.user.email === this.adminEmail) {
            this.isAdmin = true;
            const container = document.getElementById('admin-container');
            if (container && !document.getElementById('admin-btn')) {
                const adminBtn = document.createElement('button');
                adminBtn.id = 'admin-btn';
                adminBtn.innerHTML = "⭐ Panel Admin (Ver Todo)";
                adminBtn.style.marginBottom = "15px";
                adminBtn.onclick = () => app.loadAllTasksAdmin();
                container.appendChild(adminBtn);
            }
        }
    },

    editTask: async (id, currentTitle) => {
        const newTitle = prompt("Edita el título de la tarea:", currentTitle);
        if (newTitle !== null && newTitle.trim() !== "" && newTitle !== currentTitle) {
            try {
                await TaskService.updateTitle(id, newTitle.trim());
                app.loadTasks(); 
            } catch (err) {
                alert("Error al editar: " + err.message);
            }
        }
    },

    deleteTask: async (id) => {
        if (confirm("¿Seguro que quieres borrar esta tarea?")) {
            await TaskService.delete(id);
            app.loadTasks();
        }
    },

    showApp: () => {
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('app-section').style.display = 'block';
        app.checkAdmin();
        app.loadTasks();
    },

    handleLogout: async () => {
        await AuthService.logout();
        location.reload();
    }
};

window.app = app;

AuthService.getCurrentUser().then(user => {
    if (user) {
        app.user = user;
        app.showApp();
    }
});