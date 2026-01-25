"use client";

import UserDetailPage from "@/app/dashboard/components/users/UserDetailPage";
import { getStudentByID } from "@/app/dashboard/lib/db/studetns/queries";
import { UserDetails } from "@/app/dashboard/lib/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

function StudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [userData, setUserData] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchUserData = async () => {
      try {
        const userData = await getStudentByID(id);
        setUserData(userData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  if (loading) {
    return <div>กำลังโหลดข้อมูล...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!userData) {
    return <div className="py-10 text-center">ไม่พบข้อมูลผู้ใช้งาน</div>;
  }

  return (
    <div>
      <UserDetailPage userData={userData} />
    </div>
  );
}

export default StudentDetailPage;
