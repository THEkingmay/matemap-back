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
  Calendar 
} from "lucide-react";
import Link from "next/link";
import { formatDate } from "../../lib/util";
import { DormContentProps } from "../../lib/types";
import DormDeleteAlert from "./dorm-delete-alert";

function DormDetail({ dorm , email }: { dorm: DormContentProps , email?: string}) {
  const addressDetails = [
    dorm.district,
    dorm.sub_district,
    dorm.city,
    dorm.province,
    dorm.postal_code,
  ].filter(Boolean).join(" ");

  return (
    <Card className="w-full shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-1">
          {/* Header Title & Date */}
          <div className="flex justify-between items-start">
            <CardTitle className="text-2xl font-bold text-primary">
              {dorm.name}
            </CardTitle>
            <div className="flex items-center text-xs text-muted-foreground gap-1 bg-secondary/50 px-2 py-1 rounded-md">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(new Date(dorm.created_at))}</span>
            </div>
          </div>

          {/* Owner Info */}
          <div className="flex items-center text-sm text-muted-foreground gap-2 mt-1">
            <User className="h-4 w-4" />
            <span>ผู้ดูแล: <span className="font-medium text-foreground">{dorm.owner_name ?? "-"}</span></span>
          </div>
        </div>
        {/* email */}
        {email && (
          <div className="flex items-center text-sm text-muted-foreground gap-2 mt-1">
            <User className="h-4 w-4" />
            <span>อีเมล: <span className="font-medium text-foreground">{email}</span></span>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Contact Section - Grouped in a box */}
        <div className="bg-secondary/20 p-4 rounded-lg border border-secondary">
          <h4 className="text-sm font-semibold mb-3 text-foreground/80">ช่องทางการติดต่อ</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="p-2 bg-primary/10 rounded-full text-primary">
                <Phone className="h-4 w-4" />
              </div>
              <span className="font-medium">{dorm.owner_tel ?? "-"}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <div className="p-2 bg-green-500/10 rounded-full text-green-600">
                <MessageCircleMore className="h-4 w-4" />
              </div>
              <span>Line ID: {dorm?.id_line || "-"}</span>
            </div>
            
            {/* Social Link if exists */}
            {dorm?.social_media_link && (
              <div className="sm:col-span-2 mt-1">
                <Button asChild variant="outline" size="sm" className="w-full sm:w-auto gap-2 text-blue-600 hover:text-blue-700">
                  <Link href={dorm.social_media_link} target="_blank">
                    <ExternalLink className="h-4 w-4" />
                    เยี่ยมชมเพจ / เว็บไซต์
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Address Section */}
        <div className="space-y-2">
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <span>{addressDetails}</span>
          </div>
        </div>

        {/* Detail Description */}
        <div className="pt-2 border-t">
            <h4 className="text-sm font-semibold mb-2 mt-4 text-foreground/80">รายละเอียดเพิ่มเติม</h4>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {dorm.detail || "ไม่มีรายละเอียดระบุ"}
            </p>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center bg-secondary/10 py-4">
        {/* Delete Action (Critical Action usually on the left or separated) */}
        <DormDeleteAlert dormId={dorm.id} />

        {/* Edit Action (Primary Action) */}
        <Button asChild variant="default" size="sm" className="gap-2">
          <Link href={`/dashboard/dorms/edit/${dorm.id}`}>
            <Pencil className="h-4 w-4" />
            แก้ไขข้อมูล
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default DormDetail;