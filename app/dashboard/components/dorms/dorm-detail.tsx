import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ExternalLink,
  MessageCircleMore,
  Pencil,
  Phone,
  MapPin,
  User,
  Calendar,
  Mail,
  ImageIcon,
  Hash
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "../../lib/util";
import { DormContentProps } from "../../lib/types";
import DormDeleteAlert from "./dorm-delete-alert";

import SubscriptionComponent from "../subscription/subscription";
import { useEffect, useState } from "react";
import { getUserIdbyDormId } from "../../dorms/action";
import { toast } from "react-toastify";

function DormDetail({ dorm, email }: { dorm: DormContentProps; email?: string }) {

    const [loadingUserId, setLoading] = useState<boolean>(true)
    const [ uid , setUID] = useState<string>('')
    useEffect(()=>{
        // get userId of this dorm
        const fetchUserId = async () =>{
            setLoading(true)
           try{
                const data  = await getUserIdbyDormId(dorm.id)

                if(!data.success){
                    toast.error(data.error)
                }
                if(data.success && data.data){
                    setUID(data.data)
                }
           }catch(err){
            toast.error((err as Error).message)
           }finally{
            setLoading(false)
           }
        }
        fetchUserId()
    },[])


  const addressDetails = [
    dorm.district,
    dorm.sub_district,
    dorm.city,
    dorm.province,
    dorm.postal_code,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Card className="w-full max-w-3xl mx-auto overflow-hidden shadow-lg border-muted/60 flex flex-col">
      
      {/* 1. Hero / Cover Image Section */}
      {/* ใช้ relative + aspect-ratio เพื่อควบคุมสัดส่วนภาพให้คงที่เสมอ */}
      <div className="relative w-full h-56 sm:h-72 bg-muted flex items-center justify-center group">
        {dorm.image_url ? (
          <Image
            src={dorm.image_url}
            alt={dorm.name}
            fill // ให้รูปขยายเต็มพื้นที่ parent (ต้องมี relative ที่ parent)
            className="object-cover transition-transform duration-700 hover:scale-105" // Effect เล็กน้อยเมื่อเอาเมาส์ไปวาง
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority // โหลดรูปนี้ก่อนเสมอเพราะเป็นจุดเด่นสุดของหน้า
          />
        ) : (
          /* Fallback กรณีไม่มีรูป */
          <div className="flex flex-col items-center gap-3 text-muted-foreground/40">
            <div className="p-4 bg-background/50 rounded-full backdrop-blur-sm">
                <ImageIcon className="w-8 h-8" />
            </div>
            <span className="text-sm font-medium">ไม่มีรูปภาพหอพัก</span>
          </div>
        )}
        
        {/* Overlay Badge (Optional): สามารถซ้อน Badge บนรูปได้ถ้าต้องการ */}
        <div className="absolute bottom-4 left-4">
             <span className="px-3 py-1 rounded-full bg-background/90 text-primary text-xs font-semibold backdrop-blur-md border shadow-sm flex items-center gap-1.5">
                <Hash className="w-3 h-3" />
                {dorm.dorm_number}
             </span>
        </div>
      </div>

      <CardHeader className="space-y-4 pb-4">
        <div className="space-y-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
               <CardTitle className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                 {dorm.name}
               </CardTitle>
               
               {/* Date Badge */}
               <div className="flex items-center text-xs text-muted-foreground bg-secondary/30 px-2.5 py-1 rounded-md w-fit">
                  <Calendar className="h-3 w-3 mr-1.5" />
                  <span>ประกาศเมื่อ {formatDate(new Date(dorm.created_at))}</span>
               </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>ดูแลโดย <span className="font-medium text-foreground">{dorm.owner_name}</span></span>
            </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-8 flex-grow">
        {/* 2. Contact Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Contact Card 1 */}
            <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col justify-between gap-4 hover:border-primary/20 transition-colors">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <Phone className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium uppercase">เบอร์ติดต่อ</p>
                            <p className="text-base font-semibold">{dorm.owner_tel}</p>
                        </div>
                    </div>
                    {email && (
                        <>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-500/10 rounded-lg text-orange-600">
                                <Mail className="h-5 w-5" />
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-xs text-muted-foreground font-medium uppercase">อีเมล</p>
                                <p className="text-sm font-semibold truncate" title={email}>{email}</p>
                            </div>
                        </div>
                        </>
                    )}
                </div>
            </div>

            {/* Contact Card 2 */}
            <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col justify-between gap-4 hover:border-green-500/20 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/10 rounded-lg text-green-600">
                        <MessageCircleMore className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-medium uppercase">Line ID</p>
                        <p className="text-base font-semibold">{dorm.id_line || "-"}</p>
                    </div>
                </div>
                
                {dorm.social_media_link && (
                    <Button asChild variant="secondary" size="sm" className="w-full mt-auto text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 border border-blue-200/50">
                        <Link href={dorm.social_media_link} target="_blank">
                            <ExternalLink className="h-3.5 w-3.5 mr-2" />
                            ช่องทางโซเชียล
                        </Link>
                    </Button>
                )}
            </div>
        </div>

        <div className="space-y-6">
            {/* 3. Address */}
            <div className="flex gap-4 p-4 bg-muted/20 rounded-lg border border-dashed border-muted-foreground/20">
                <MapPin className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-foreground">ที่อยู่หอพัก</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {addressDetails || "ไม่ระบุข้อมูลที่อยู่"}
                    </p>
                </div>
            </div>

            {/* 4. Details */}
            <div className="space-y-3">
                <h3 className="font-semibold text-foreground flex items-center gap-2 text-lg">
                    รายละเอียดเพิ่มเติม
                </h3>
                <div className="text-sm text-muted-foreground leading-7 whitespace-pre-wrap">
                    {dorm.detail || "เจ้าของหอพักยังไม่ได้ระบุรายละเอียดเพิ่มเติม"}
                </div>
            </div>

            {(loadingUserId || !uid) && (
                <div>
                    กำลังดึงไอดีผู้ใช้ ...
                </div>
            )}
            {!loadingUserId && uid && <SubscriptionComponent id={uid} />}
        </div>
      </CardContent>

      <CardFooter className="bg-muted/10 border-t p-6 flex flex-col sm:flex-row justify-between items-center gap-4 mt-auto">
        <div className="w-full sm:w-auto">
            <DormDeleteAlert dormId={dorm.id} />
        </div>
        
        <Button asChild size="default" className="w-full sm:w-auto shadow-sm transition-transform active:scale-95">
          <Link href={`/dashboard/dorms/edit/${dorm.id}`}>
            <Pencil className="h-4 w-4 mr-2" />
            แก้ไขข้อมูล
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default DormDetail;