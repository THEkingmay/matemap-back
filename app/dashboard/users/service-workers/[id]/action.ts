'use server'
import { WorkerDetailType } from "./page";
import supabase from "@/configs/supabase";
import { IsAdmin } from "@/utils/token";
import { Job } from "./page";

export async function getWorkerDetail(worker_id: string) {
    try {
        // 1. Security Check
        const isAdmin = await IsAdmin();
        if (!isAdmin) return { success: false, message: "คุณไม่มีสิทธิ" };

        // 2. Fetch Base Worker Data
        const { data: workerDetail, error: workerError } = await supabase
            .from('service_worker_detail')
            .select("*")
            .eq('id', worker_id)
            .single();

        if (workerError || !workerDetail) {
            return { success: false, message: "ไม่พบข้อมูลพนักงาน" };
        }

        // 3. Parallel Execution for Related Data
        // We run these together because they don't depend on each other, 
        // they only depend on the worker_id.
        const [servicesResult, historyResult] = await Promise.all([
            // Task A: Find Service IDs and Names
            // Note: This is still a bit 'manual'. A Join is better, but this fixes your flow.
            supabase
                .from('service_and_worker')
                .select(`
                    service_id,
                    services ( id, name )
                `) // Assuming FK exists. If not, you must keep your 2-step fetch.
                .eq('user_id', worker_id),

            // Task B: Fetch History
            supabase
                .from('service_history')
                .select('*')
                .eq('provider_id', worker_id)
                .order('created_at')
        ]);

        // 4. Construct Data
        // We map the weird join structure to a cleaner list if needed
        const jobs: Job[] = servicesResult.data?.map((item : any) => {
            const s = item.services; 
            return {
                id: s?.id || "",
                name: s?.name || "Unknown Service"
            };
        }) || [];

        const data: WorkerDetailType = {
            detail: workerDetail,
            job: jobs , // Now contains actual service names/details
            job_history: historyResult.data || []
        };

        return { success: true, data: data };

    } catch (err) {
        // Log the error for debugging, don't just throw
        console.error("getWorkerDetail Error:", err);
        return { success: false, message: "เกิดข้อผิดพลาดในระบบ" };
    }
}
