import { DormListProps } from "../../lib/types";
import DormCard from "./dorm-card";
import { FolderSearch } from "lucide-react";

function DormList({ dorms }: { dorms: DormListProps[] }) {
  // Empty State: ใช้ Icon และข้อความที่ชัดเจน
  if (!dorms || dorms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center border-2 border-dashed rounded-xl bg-muted/30 animate-in fade-in-50">
        <div className="bg-background p-4 rounded-full shadow-sm mb-4">
          <FolderSearch className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-1">
          ยังไม่มีข้อมูลหอพัก
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm mb-6">
          คุณยังไม่ได้เพิ่มรายการหอพักลงในระบบ ลองสร้างรายการใหม่
          เพื่อให้ผู้ใช้คนอื่นค้นหาเจอได้เลยค่ะ
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-2xl font-bold tracking-tight">รายการหอพักทั้งหมด</h2>
        <span className="text-sm text-muted-foreground">
          {dorms.length} รายการ
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {dorms.map((dorm) => (
          <DormCard dorm={dorm} key={dorm.id} />
        ))}
      </div>
    </section>
  );
}

export default DormList;