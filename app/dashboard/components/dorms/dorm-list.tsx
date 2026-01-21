import { DormListProps } from "../../lib/types";
import DormCard from "./dorm-card";

function DormList({ dorms }: { dorms: DormListProps[] }) {
  return (
    <div className="grid grid-cols-1 mt-10 ml-5 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {dorms.map(dorm => (
        <DormCard dorm={dorm} key={dorm.id} />
      ))}
    </div>
  );
}

export default DormList;
