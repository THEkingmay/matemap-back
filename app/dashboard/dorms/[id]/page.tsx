"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getDormByID } from "../../lib/db/dorms/queries";
import DormDetail from "../../components/dorms/dorm-detail";
import { DormContentProps } from "../../lib/types";

function DormDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [dorm, setDorm] = useState<DormContentProps | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchDorm = async () => {
      try {
        const data = await getDormByID(id);
        setDorm(data.data);
        setEmail(data.owner_email || null);
      } catch (err) {
        console.error(err);
        setError("ไม่สามารถโหลดข้อมูลหอพักได้");
      } finally {
        setLoading(false);
      }
    
    };

    fetchDorm();
  }, [id]);

  if (loading) {
    return <div>กำลังโหลดข้อมูล...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!dorm) {
    return <div className="py-10 text-center">ไม่พบข้อมูลหอพัก</div>;
  }

  // console.log(dorm);

  return (
    <main className="py-10">
      <div className="max-w-4xl mx-auto">
        <DormDetail dorm={dorm} email={email || ''} />
      </div>
    </main>
  );
}

export default DormDetailPage;
