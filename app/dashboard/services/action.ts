'use server'

import supabase from "@/configs/supabase"
import { IsAdmin } from "@/utils/token"

export async function updateServiceName(service_id : string , newName : string) {
    try{
        const idAdmin = await IsAdmin()
        if(!IsAdmin) return {success : false ,error : 'คุณไม่มีสิทธิ'}
 
        const {error}  =await supabase
        .from('services')
        .update({name : newName})
        .eq('id' , service_id)
 
        if(error) throw error

        return {success : true}
    }catch(err){    
        throw err
    }
}

export async function deleteService(service_id : string) {
    try{
        const idAdmin = await IsAdmin()
        if(!IsAdmin) return {success : false ,error : 'คุณไม่มีสิทธิ'}


        const {error}  =await supabase
        .from('services')
        .delete()
        .eq('id' , service_id)
 
        if(error) throw error

        return {success : true}
    }catch(err){
        throw err
    }
}