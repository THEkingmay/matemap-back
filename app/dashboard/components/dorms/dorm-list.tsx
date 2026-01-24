import { DormListProps } from "../../lib/types";
import DormCard from "./dorm-card";

function DormList({ dorms }: { dorms: DormListProps[] }) {
  // กรณีไม่มีข้อมูล (Empty State) - ควรมีไว้เพื่อ UX ที่ดี
  if (!dorms || dorms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-lg bg-muted/50">
        <p className="text-lg font-medium text-muted-foreground">ไม่พบข้อมูลหอพัก</p>
        <p className="text-sm text-muted-foreground/80">ลองเพิ่มหอพักใหม่ดูสิคะ</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {dorms.map((dorm) => (
          <DormCard dorm={dorm} key={dorm.id} />
        ))}
      </div>
    </div>
  );
}

export default DormList;