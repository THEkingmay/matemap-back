import supabase from "@/configs/supabase";

export async function isOverlap(
    start_date: string, 
    end_date: string, 
    userId: string, 
    excludeId: number | null = null 
): Promise<boolean> {

    let query = supabase
        .from('service_timetable')
        .select('id')
        .eq('service_provider_id', userId) 
        .lt('start_date', end_date) 
        .gt('end_date', start_date);

    if (excludeId) {
        query = query.neq('id', excludeId);
    }

    const { data, error } = await query.limit(1);

    if (error) {
        console.error("Error checking overlap:", error);
        throw new Error(error.message);
    }

    return (data && data.length > 0) || false;
}