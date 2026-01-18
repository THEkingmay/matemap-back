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
import { Save, Trash } from "lucide-react";

type DormEditProps = {
  dormId: number;
};

function DormEditAlert({ dormId }: DormEditProps) {
  return (
    <div className="ml-3">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Save className="h-4 w-4 mr-1" />
            บันทึก
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              คุณต้องการบันทึกการแก้ไขข้อมูลหอพักนี้ใช่หรือไม่?
            </AlertDialogTitle>
            <AlertDialogDescription>
              การแก้ไขข้อมูลจะมีผลกับข้อมูลเดิม โปรดตรวจสอบความถูกต้องก่อนบันทึก
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                console.log("update dorm", dormId);

                // TODO: call server action
              }}
            >
              ยืนยันการแก้ไข
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default DormEditAlert;
