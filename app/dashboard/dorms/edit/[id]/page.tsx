"use client";

import {
  getDormByID,
  // updateDormByID,
} from "@/app/dashboard/lib/db/dorms/queries";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FormEditData } from "@/app/dashboard/lib/types";
import DormEdit from "@/app/dashboard/components/dorms/dorm-edit";

function DormEditPage() {
  const { id } = useParams<{ id: string }>();

  const [dormData, setDormData] = useState<FormEditData>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    getDormByID(id)
      .then((data: FormEditData) => {
        setDormData(data);
      })
      .catch(err => {
        console.error(err);
        setError("ไม่สามารถโหลดข้อมูลหอพักได้");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div>กำลังโหลดข้อมูล...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <main className="py-10">
      <div className="max-w-4xl mx-auto">
        {dormData && <DormEdit dorm={dormData} />}
      </div>
    </main>
  );
}

export default DormEditPage;
