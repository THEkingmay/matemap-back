"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Link from "next/link";
import { DormListProps } from "../../lib/types";
import { formatDate } from "../../lib/util";
import { Building2, Calendar, User } from "lucide-react"; // แนะนำให้ลง lucide-react เพิ่ม
import Image from "next/image";

function DormCard({ dorm }: { dorm: DormListProps }) {
  return (
    <Link href={`/dashboard/dorms/${dorm.id}`} className="block group h-full">
      <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-muted/60">
        
        {/* Image Placeholder Section - หอพักควรมีรูปภาพ ถ้ายังไม่มีใช้ Icon แทนไปก่อน */}
          <div className="relative w-full aspect-video bg-muted flex items-center justify-center group-hover:bg-muted/80 transition-colors">
           {
            dorm.image_url ? (
               <Image
                src={dorm.image_url}
                alt={dorm.name}
                fill
                className="object-cover"
              />
            ) : (
              <div>ไม่มีรูปภาพ</div>
            )
           }
        </div>

        <CardHeader className="pb-2">
          <h3 className="text-lg font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {dorm.name}
          </h3>
        </CardHeader>

        <CardContent className="flex-grow">
           {/* พื้นที่สำหรับใส่รายละเอียดเพิ่มเติมในอนาคต เช่น ราคา หรือ สถานที่ */}
           <p className="text-sm text-muted-foreground line-clamp-2">
             รายละเอียดหอพัก...
           </p>
        </CardContent>

        <CardFooter className="pt-0 pb-4 flex flex-col gap-2 text-xs text-muted-foreground border-t bg-muted/20 mt-auto p-4">
          <div className="flex items-center w-full gap-2">
            <User className="w-3 h-3" />
            <span className="truncate">โดย {dorm.owner_name}</span>
          </div>
          <div className="flex items-center w-full gap-2">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(new Date(dorm.created_at))}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

export default DormCard;