'use server'
import supabase from "@/configs/supabase"
import { hash_password_genarate } from "@/utils/token"

export async function InsertMemberAndService(email: string, password: string, role: 'member' | 'service', name: string) {
    let createdUserId: string | null = null;

    try {
        // 1. Hash Password
        const hash_password = await hash_password_genarate(password)

        // 2. Insert into Supabase (Users Table)
        const { data: userData, error: userError } = await supabase
            .from('users')
            .insert({ email, hash_password, role })
            .select()
            .single()

        if (userError) {
            console.error('Supabase User Error:', userError.message)
            throw new Error(userError.message)
        }

        // เก็บ ID ไว้ ถ้าขั้นตอนต่อไปพัง เราจะใช้ ID นี้ลบ user ทิ้ง
        createdUserId = userData.id;

        // 3. แยกตาม role เพื่อบันทึกข้อมูลเสริม
        if (role === 'member') {
            // บันทึกลง dorm_detail
            const { error: memberError } = await supabase
                .from('dorm_detail')
                .insert({
                    name : name ,
                    owner_name: name,
                    user_id: userData.id
                })

            if (memberError) throw new Error(`Failed to create member profile: ${memberError.message}`);

        } else if (role === 'service') {
            // บันทึกลง service_worker_detail
            const { error: serviceError } = await supabase
                .from('service_worker_detail')
                .insert({
                    name: name,
                    id: userData.id 
                })

            if (serviceError) throw new Error(`Failed to create service profile: ${serviceError.message}`);
        }

        // เพิ่มลงตาราง subscription
        const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .insert({
            user_id : userData.id
        })
        if(subscriptionError) throw subscriptionError

        return userData

    } catch (err) {
        console.error('InsertMemberAndService Error:', (err as Error).message)

        if (createdUserId) {
            console.warn(`Rolling back: Deleting orphaned user ${createdUserId}...`)
            await supabase.from('users').delete().eq('id', createdUserId)
        }
        
        throw new Error((err as Error).message|| 'Something went wrong during registration')
    }
}