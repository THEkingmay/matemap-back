"use client";

import { useEffect, useState } from "react";
import {
  DormUserDisplay,
  StudentUserDisplay,
  WorkerUserDisplay,
} from "../lib/types";
import { GetStudents } from "../lib/db/studetns/queries";
import AllUsersList from "../components/users/AllUsersPage";
import { GetServiceWorkers } from "../lib/db/services/queries";
import { getDorms } from "../lib/db/dorms/queries";

function AllUsersPage({}) {
  const [students, setStudents] = useState<StudentUserDisplay[]>([]);
  const [serviceWorkers, setServiceWorkers] = useState<WorkerUserDisplay[]>([]);
  const [dorms, setDorms] = useState<DormUserDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([GetStudents(), GetServiceWorkers(), getDorms()])
      .then(([studentsData, workersData, dormsData]) => {
        setStudents(studentsData);
        setServiceWorkers(workersData);
        setDorms(dormsData);
      })
      .catch(err => {
        console.error(err);
        setError("ไม่สามารถโหลดข้อมูลผู้ใช้งานได้");
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

  return (
    <AllUsersList
      students={students}
      serviceWorkers={serviceWorkers}
      dorms={dorms}
    />
  );
}

export default AllUsersPage;
function GetWorkers(): any {
  throw new Error("Function not implemented.");
}
