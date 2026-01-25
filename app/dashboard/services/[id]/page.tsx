'use client'
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function ServiceDetail({params} : {params :Promise<{id : string}>}){


  // const fetchServiceDetail = async () =>{
  //   try{
  //     const res = await fetch(`/api/services/${id}`)

  //   //   const data = await res.json()
  //   //   if(!res.ok) throw new 
  //   //   console.log(data)
  //   // }catch(err){

  //   }
  // }

  // useEffect(()=>{

  // }, [])

  return (
    <div>
      service detail
    </div>
  )
}