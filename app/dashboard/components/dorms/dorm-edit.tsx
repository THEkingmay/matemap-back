"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DormEditAlert from "./dorm-edit-alert";
import { DormContentProps } from "../../lib/types";
import { formatDate } from "../../lib/util";
import Link from "next/link";
import { useRouter } from "next/navigation";

type DormEditProps = {
  dormId: number;
};

function DormEdit({ dorm }: { dorm : DormContentProps}) {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl">แก้ไข {dorm.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Edit form</p>
      </CardContent>
      {
        <CardFooter>
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            ยกเลิก
          </Button>
          <DormEditAlert dormId={dorm.id} />
        </CardFooter>
      }
    </Card>
  );
}

export default DormEdit;
