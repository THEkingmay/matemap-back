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

import { updateStatusPost } from "../posts/action";
import { toast } from "react-toastify";

type PostApproveProps = {
  postID: string;
  onSuccess?: () => void; // ลบโพสต์ที่อนุมัติแล้วออก 
};

function PostApproveAlert({ postID , onSuccess }: PostApproveProps) {

  const handleApprove = async () => {
    try{
      toast.promise(
        updateStatusPost(postID, "approved"),
        {
          pending: "กำลังอนุมัติโพสต์...",
          success: "อนุมัติโพสต์เรียบร้อยแล้ว!",
          error: "เกิดข้อผิดพลาดในการอนุมัติโพสต์",
        }
      );
      onSuccess && onSuccess();
    } catch (error) {
      console.error("Error approving post:", error);
    }
  };


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
              // ปิด dialog และเรียกใช้ฟังก์ชันอนุมัติ
              onClick={handleApprove}
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
