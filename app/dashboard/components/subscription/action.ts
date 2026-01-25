'use server'
import supabase from "@/configs/supabase"
import { IsAdmin } from "@/utils/token"

export async function getAllSubscriptionHistoryByUserId(user_id : string){
    try{

        const isAdmin = await IsAdmin()
        if(!isAdmin) return {success : false , error : 'คุณไม่มีสิทธิ'}

        const {data , error} = await supabase
        .from('subscriptions')
        .select("*")
        .eq('user_id' , user_id)
        .order('expired_date' , {ascending : false})

        if(error) throw error
        
        return {success : true , data}
        
    }catch(er){
        throw er
    }
}

export async function resumeSubscription(user_id : string) {
    try{

        const isAdmin = await IsAdmin()
        if(!isAdmin) return {success : false , error : 'คุณไม่มีสิทธิ'}

        const {data , error} = await supabase
        .from('subscriptions')
        .insert({'user_id' : user_id})
        .select() // update ui
        .single()

        if(error) throw error
        
        return {success : true ,data  }
        
    }catch(er){
        throw er
    }
}