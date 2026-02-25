import { supabase } from './supabaseClient';

export class StorageService {
    // Subir archivo a un bucket específico
    static async uploadFile(bucketName, file, folderPath = '') {
        const fileName = `${Date.now()}_${file.name}`;
        const filePath = folderPath ? `${folderPath}/${fileName}` : fileName;

        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(filePath, file);

        if (error) throw error;

        // Obtener la URL pública del archivo
        const { data: urlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(filePath);

        return urlData.publicUrl;
    }

    // Borrar un archivo
    static async deleteFile(bucketName, filePath) {
        const { error } = await supabase.storage
            .from(bucketName)
            .remove([filePath]);

        if (error) throw error;
    }
}