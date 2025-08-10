'use server'

import { supabase } from "./supabaseClient"

export async function addAction(type: string, title: string, reward: number) {
    const { error } = await supabase.from('actions')
    .insert([
        {type: type, title: title, reward: reward}
    ])
    if (error) {
        console.warn("There was an error adding the actions:", error)
        return
    }
}