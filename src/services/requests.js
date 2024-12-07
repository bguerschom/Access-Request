// src/services/requests.js
import { supabase } from '@/config/supabase'

export const requestService = {
  create: async (requestData) => {
    try {
      const { data, error } = await supabase
        .from('requests')
        .insert([requestData])
        .select()
      
      if (error) throw error
      return { id: data[0].id, error: null }
    } catch (error) {
      return { id: null, error: error.message }
    }
  },

  update: async (id, updates) => {
    try {
      const { error } = await supabase
        .from('requests')
        .update(updates)
        .eq('id', id)
      
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: error.message }
    }
  },

  delete: async (id) => {
    try {
      const { error } = await supabase
        .from('requests')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: error.message }
    }
  }
}
