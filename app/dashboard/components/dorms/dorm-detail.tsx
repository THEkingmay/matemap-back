import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { formatDate } from "../../lib/util";
import { DormContentProps } from "../../lib/types";
import DormDeleteAlert from "./dorm-delete-alert";

function DormDetail({ dorm }: DormContentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl">{dorm.name}</CardTitle>
        <CardDescription>
          ผู้ดูแลบัญชี {dorm.landlord.name} - {formatDate(dorm.createdAt)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-md mb-6">
          {Object.values(dorm.address).join(" ")}
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
