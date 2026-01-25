'use client'

import { useParams } from "next/navigation"

import { Worker } from "@/app/dashboard/services/[id]/page"

export interface Job {
  id : string , 
  name : string ,
}

export interface JobHistory{
  id: number; // bigint ใน SQL มักแมพเป็น number หรือ string ใน TS
  created_at: Date;
  customer_id: string; // uuid
  provider_id: string; // uuid
  service_type_id: string; // uuid
  start_location?: string; 
  destination_location: string;
  detail?: string; 
  status: 'accepted'| 'rejected' | 'pending' | 'done' | 'progressing'; 
  start_date: string;
  end_date: string;
}

export interface WorkerDetailType{
  detail : Worker , 
  job : Job[] , 
  job_history : JobHistory[]
} 

export default function ServiceWorkerDetail({params} : {params: Promise<{id : string}>}){
  const {id} = useParams()
  
  return(
    <div>

    </div>
  )
}