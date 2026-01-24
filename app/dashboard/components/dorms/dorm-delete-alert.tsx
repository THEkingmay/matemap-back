"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash } from "lucide-react";
import { deleteDormByID } from "../../lib/db/dorms/queries";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

type DormDeleteProps = {
  dormId: string;
};

function DormDeleteAlert({ dormId }: DormDeleteProps) {
  const router = useRouter();

  return (
    <div className="ml-3">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Trash className="h-4 w-4 mr-1" />
            ลบ
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>คุณต้องการลบหอพักนี้ใช่หรือไม่?</AlertDialogTitle>
            <AlertDialogDescription>
              การดำเนินการนี้ไม่สามารถย้อนกลับได้
              และจะลบข้อมูลหอพักนี้ออกอย่างถาวร
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                try {
                  await deleteDormByID(dormId);
                  toast.success("ลบหอพักสำเร็จ");
                  router.replace("/dashboard/dorms");
                } catch (err) {
                  console.error(err);
                  toast.error("ลบหอพักไม่สำเร็จ");
                }
              }}
            >
              ยืนยันการลบ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default DormDeleteAlert;
