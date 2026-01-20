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

type PostDisapproveProps = {
  postID: string;
};

function PostDisapproveAlert({ postID }: PostDisapproveProps) {
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
              onClick={() => {
                console.log("disapprove post", postID);
                // TODO: call server action
              }}
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
