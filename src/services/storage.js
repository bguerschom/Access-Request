// src/services/storage.js
import { supabase } from '@/config/supabase'

export const storageService = {
  uploadFile: async (file, path) => {
    try {
      const { data, error } = await supabase.storage
        .from('pdfs')
        .upload(path, file)
      
      if (error) throw error
      return { url: data.path, error: null }
    } catch (error) {
      return { url: null, error: error.message }
    }
  },

  getFileUrl: async (path) => {
    const { data } = supabase.storage
      .from('pdfs')
      .getPublicUrl(path)
    
    return data.publicUrl
  }
}
