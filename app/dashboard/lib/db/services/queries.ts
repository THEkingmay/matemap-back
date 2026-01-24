import { WorkerUserDisplay } from "../../types";

// Fetch all students
export async function GetServiceWorkers(): Promise<WorkerUserDisplay[]>{
  const res = await fetch(`/api/service-workers`);
  if (!res.ok) throw new Error('Failed to fetch service worker');

  const data = await res.json();

  const flattedData = data
    .filter((row: any) => row.service_worker_detail)
    .map((row: any): WorkerUserDisplay => ({
      type: "คนรับจ้าง",
      id: row.id,
      name: row.service_worker_detail.name,
      tel: row.service_worker_detail.tel,
      image_url: row.service_worker_detail.image_url,
      created_at: row.service_worker_detail.created_at,

      services: row.service_and_worker.map((service_worker: any) => ({
        id: service_worker.services.id,
        name: service_worker.services.name,
      })),
    }));

  return flattedData;
}