'use server';
import supabase from "@/configs/supabase";

export async function getPostsByStatus(status: string) {
    try {
        const { data, error } = await supabase
            .from('contract_posts')
            .select('*')
            .eq('status', status);
        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        throw error;
    }
}

export async function updateStatusPost(postID: string, status: string) {
    try {
        const { data, error } = await supabase
            .from('contract_posts')
            .update({ status: status })
            .eq('id', postID);  
        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        throw error;
    }
}

export async function get100Posts(lastIndexCreatedAt?: string) {
    try {
        // ถ้าโหลดครั้งแรก ให้ดึง 100 โพสต์ล่าสุด
        if (!lastIndexCreatedAt) {
            const { data, error } = await supabase
                .from('contract_posts')
                .select('*')
                .order('created_at', { ascending: false }) // ใหม่ไปเก่า
                .limit(100);
            if (error) {
                throw error;
            }
            return data;
        } else {
            // ถ้าโหลดเพิ่มเติม ให้ดึงโพสต์ที่สร้างก่อน lastIndexCreatedAt 
            const { data, error } = await supabase
                .from('contract_posts')
                .select('*')
                .lt('created_at', lastIndexCreatedAt) // น้อยกว่า lastIndexCreatedAt สร้างก่อนหน้า แปลวว่าเก่ากว่า
                .order('created_at', { ascending: false }) // ใหม่ไปเก่า
                .limit(100);

            if (error) {
                throw error;
            }
            return data;
        }
    } catch (error) {
        throw error;
    }
}

export async function getPostByID(postID: string) {
    try {
        const { data, error } = await supabase
            .from('contract_posts')
            .select('*')
            .eq('id', postID)
            .single();
        if (error) {
            throw error;
        }
        
        // ดึงข้อมูลเจ้าของโพสต์
        const { data: ownerData, error: ownerError } = await supabase
            .from('user_detail')
            .select('*')
            .eq('id', data.user_id)
            .single();
        if (ownerError) {
            throw ownerError;
        }
        return { post: data, owner: ownerData };
    } catch (error) {
        throw error;
    }
}