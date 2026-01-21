"use client";

import { useEffect, useState } from "react";
import DormList from "../components/dorms/dorm-list";
import { getDorms } from "../lib/db/dorms/queries";
import { DormListProps } from "../lib/types";

function DormsHomePage() {
  const [dorms, setDorms] = useState<DormListProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDorms()
      .then((data: DormListProps[]) => {
        setDorms(data);
      })
      .catch(err => {
        console.error(err);
        setError("ไม่สามารถโหลดข้อมูลหอพักได้");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>กำลังโหลดข้อมูล...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return <DormList dorms={dorms} />;
}

export default DormsHomePage;
