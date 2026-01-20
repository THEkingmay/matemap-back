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
import { Check } from "lucide-react";

type PostApproveProps = {
  postID: string;
};

function PostApproveAlert({ postID }: PostApproveProps) {
  return (
    <div className="ml-3">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className="p-2 hover:bg-green-50 rounded-lg text-green-600">
            <Check size={20} />
          </button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              คุณต้องการอนุมัติโพสต์นี้ใช่หรือไม่?
            </AlertDialogTitle>
            <AlertDialogDescription>
              การอนุมัติโพสต์นี้จะทำให้โพสต์ถูกเผยแพร่และแสดงต่อผู้ใช้งานทั่วไป
              กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนดำเนินการ
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                console.log("disapprove post", postID);
                // TODO: call server action
              }}
            >
              อนุมัติ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default PostApproveAlert;
