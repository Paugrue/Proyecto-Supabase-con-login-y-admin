import { supabase } from './supabaseClient';

export class AuthService {
    // Registro de nuevo usuario
    static async signUp(email, password) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        return data.user;
    }

    // Iniciar sesión
    static async login(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data.user;
    }

    // Cerrar sesión
    static async logout() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    }

    // Obtener sesión actual
    static async getCurrentUser() {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    }
}