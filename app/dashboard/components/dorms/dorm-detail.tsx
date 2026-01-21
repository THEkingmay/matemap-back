import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExternalLink, MessageCircleMore, Pencil, Phone } from "lucide-react";
import Link from "next/link";
import { formatDate } from "../../lib/util";
import { DormContentProps } from "../../lib/types";
import DormDeleteAlert from "./dorm-delete-alert";

function DormDetail({ dorm }: { dorm: DormContentProps }) {
  const addressDetails = [
    dorm.district,
    dorm.sub_district,
    dorm.city,
    dorm.province,
    dorm.postal_code,
  ].filter(Boolean);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl">{dorm.name}</CardTitle>
        <CardDescription>
          ผู้ดูแลบัญชี {dorm.owner_name ?? "-"} -{" "}
          {formatDate(new Date(dorm.created_at))}
          {/* waiting for the landloard name */}
        </CardDescription>
        <div className="flex cols-2 items-center">
          <div className="flex gap-2">
            <Phone />
            <p className="flex items-end text-sm ">
              Tel. {dorm.owner_tel ?? "-"}
            </p>
          </div>
          <div className="flex gap-2 ml-3">
            <MessageCircleMore />
            <p className="flex items-end text-sm">ID Line: {dorm?.id_line}</p>
          </div>
          {dorm?.social_media_link !== undefined && (
            <Button asChild variant={"ghost"}>
              <Link href={`${dorm?.social_media_link}`}>
                <ExternalLink />
                Link
              </Link>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-md mb-6">
          {addressDetails.join(" ")}
        </p>

        <p className="text-muted-foreground text-md mb-6">{dorm.detail}</p>
      </CardContent>
      {
        <CardFooter>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/dashboard/dorms/edit/${dorm.id}`}>
                <Pencil className="h-4 w-4" />
                แก้ไข
              </Link>
            </Button>
          </div>
          <DormDeleteAlert dormId={dorm.id} />
        </CardFooter>
      }
    </Card>
  );
}

export default DormDetail;
