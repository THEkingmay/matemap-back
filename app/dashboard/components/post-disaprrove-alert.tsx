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
import { X } from "lucide-react";

import { updateStatusPost } from "../posts/action";
import { toast } from "react-toastify";
import { on } from "events";

type PostDisapproveProps = {
  postID: string;
  onSuccess?: () => void; // ลบโพสต์ที่ไม่อนุมัติแล้วออก
};

function PostDisapproveAlert({ postID, onSuccess }: PostDisapproveProps) {

  const handleRejected = async () => {
    try{
      toast.promise(
        updateStatusPost(postID, "rejected"),
        {
          pending: "กำลังไม่อนุมัติโพสต์...",
          success: "ไม่อนุมัติโพสต์เรียบร้อยแล้ว!",
          error: "เกิดข้อผิดพลาดในการไม่อนุมัติโพสต์",
        }
      );
      onSuccess && onSuccess();
    } catch (error) {
      console.error("Error rejecting post:", error);
    }
  };
  return (
    <div className="ml-3">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className="p-2 hover:bg-red-50 rounded-lg text-red-600">
            <X size={20} />
          </button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              คุณไม่อนุมัติโพสต์นี้ใช่หรือไม่?
            </AlertDialogTitle>
            <AlertDialogDescription>
              การดำเนินการนี้ไม่สามารถย้อนกลับได้
              และจะลบข้อมูลโพสต์นี้ออกอย่างถาวร
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction
              // ปิด dialog และเรียกใช้ฟังก์ชันไม่อนุมัติ
              onClick={handleRejected}
            >
              ไม่อนุมัติ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default PostDisapproveAlert;
