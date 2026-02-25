import { supabase } from './supabaseClient';

export class TaskService {
    // Obtener las tareas del usuario logueado 
    static async getAll() {
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data;
    }

    // Obtener TODAS las tareas (Solo para ADMIN)
    static async getAllAdmin() {
        const { data, error } = await supabase
            .from('tasks')
            .select('*') 
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data;
    }

    // Crear una nueva tarea con soporte para archivos
    static async create(title, userId, fileUrl = null) {
        const { data, error } = await supabase
            .from('tasks')
            .insert([{ 
                title: title, 
                user_id: userId, 
                file_url: fileUrl 
            }])
            .select();
        
        if (error) throw error;
        return data[0];
    }

    // Actualizar el título de una tarea 
    static async updateTitle(taskId, newTitle) {
        const { data, error } = await supabase
            .from('tasks')
            .update({ title: newTitle })
            .eq('id', taskId)
            .select();
        
        if (error) throw error;
        return data;
    }

    // Actualizar estado 
    static async updateStatus(taskId, isCompleted) {
        const { data, error } = await supabase
            .from('tasks')
            .update({ is_completed: isCompleted })
            .eq('id', taskId)
            .select();
        
        if (error) throw error;
        return data;
    }

    // Eliminar tarea 
    static async delete(taskId) {
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', taskId);
        
        if (error) throw error;
    }
}