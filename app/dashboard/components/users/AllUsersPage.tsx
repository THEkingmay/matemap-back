"use client";

import React, { useState, useMemo, JSX } from "react";
import {
  Search,
  User,
  GraduationCap,
  Briefcase,
  Building2,
  Filter,
} from "lucide-react";
import {
  DormUserDisplay,
  StudentUserDisplay,
  UserType,
  WorkerUserDisplay,
} from "../../lib/types";
import { formatDate } from "../../lib/util";
import { useRouter } from "next/navigation";

type FilterType = "ทั้งหมด" | "นิสิต" | "คนรับจ้าง" | "หอพัก";

type Props = {
  students: StudentUserDisplay[];
  serviceWorkers: WorkerUserDisplay[];
  dorms: DormUserDisplay[];
};

const AllUsersList = ({ students, serviceWorkers, dorms }: Props) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterType, setFilterType] = useState<FilterType>("ทั้งหมด");
  const router = useRouter();

  const allUsers: UserType[] = useMemo(() => {
    return [
      ...students.map(student => ({ ...student, type: "นิสิต" as const })),
      ...serviceWorkers.map(serviceWorker => ({
        ...serviceWorker,
        type: "คนรับจ้าง" as const,
      })),
      ...dorms.map(dorm => ({ ...dorm, type: "หอพัก" as const })),
    ];
  }, [students, serviceWorkers, dorms]);

  const filteredUsers = useMemo(() => {
    return allUsers.filter(user => {
      if (filterType !== "ทั้งหมด" && user.type !== filterType) return false;

      const term = searchTerm.toLowerCase();
      if (!term) return true;

      if (user.name?.toLowerCase().includes(term)) return true;

      if (user.type === "นิสิต") {
        return (
          user.faculty?.toLowerCase().includes(term) ||
          user.major?.toLowerCase().includes(term)
        );
      }

      if (user.type === "หอพัก") {
        return (
          user.owner_name?.toLowerCase().includes(term) ||
          user.city?.toLowerCase().includes(term)
        );
      }

      return false;
    });
  }, [allUsers, searchTerm, filterType]);

  const getTypeIcon = (type: UserType["type"]) => {
    switch (type) {
      case "นิสิต":
        return <GraduationCap className="w-5 h-5 text-blue-600" />;
      case "คนรับจ้าง":
        return <Briefcase className="w-5 h-5 text-green-600" />;
      case "หอพัก":
        return <Building2 className="w-5 h-5 text-purple-600" />;
      default:
        return <User className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeBadge = (type: string): JSX.Element => {
    const styles: Record<string, string> = {
      นิสิต: "bg-blue-100 text-blue-800",
      คนรับจ้าง: "bg-green-100 text-green-800",
      หอพัก: "bg-purple-100 text-purple-800",
    };
    const labels: Record<string, string> = {
      นิสิต: "นิสิต",
      คนรับจ้าง: "คนรับจ้าง",
      หอพัก: "หอพัก",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${styles[type]}`}
      >
        {labels[type]}
      </span>
    );
  };

  const renderTableRow = (user: UserType): JSX.Element => {
    if (user.type === "นิสิต") {
      return (
        <tr
          key={user.id}
          className="border-b border-gray-200 hover:bg-gray-50 transition"
        >
          <td className="py-4 px-6">
            <div className="flex items-center gap-3">
              <img
                src={
                  user.image_url ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${user.name[0]}`
                }
                alt={user.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <div className="font-medium text-gray-800">{user.name}</div>
                <div className="text-sm text-gray-500">ID: {user.id}</div>
              </div>
            </div>
          </td>
          <td className="py-4 px-6">
            <div className="flex items-center gap-2">
              {getTypeIcon(user.type)}
              {getTypeBadge(user.type)}
            </div>
          </td>
          <td className="py-4 px-6">
            <div className="text-gray-800">{user.faculty ?? "ไม่มีข้อมูล"}</div>
            <div className="text-sm text-gray-500">{user.major}</div>
          </td>
          <td className="py-4 px-6 text-gray-600">
            {user.birth_year ?? "ไม่มีข้อมูล"}{" "}
          </td>
          <td className="py-4 px-6">
            <button
              className="text-blue-600 hover:text-blue-800 font-medium"
              onClick={() =>
                router.push(`/dashboard/users/students/${user.id}`)
              }
            >
              รายละเอียด
            </button>
          </td>
        </tr>
      );
    } else if (user.type === "คนรับจ้าง") {
      return (
        <tr
          key={user.id}
          className="border-b border-gray-200 hover:bg-gray-50 transition"
        >
          <td className="py-4 px-6">
            <div className="flex items-center gap-3">
              <img
                src={
                  user.image_url ??
                  `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`
                }
                alt={user.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <div className="font-medium text-gray-800">{user.name}</div>
                <div className="text-sm text-gray-500">ID: {user.id}</div>
              </div>
            </div>
          </td>
          <td className="py-4 px-6">
            <div className="flex items-center gap-2">
              {getTypeIcon(user.type)}
              {getTypeBadge(user.type)}
            </div>
          </td>
          <td className="py-4 px-6">
            <div className="text-gray-800">{user.tel ?? "ไม่มีข้อมูล"}</div>
          </td>
          <td className="py-4 px-6 text-gray-600">
            <div className="text-gray-800">วันที่สมัครบัญชี</div>
            <div className="text-sm text-gray-500">
              {formatDate(new Date(user.created_at))}
            </div>
          </td>
          <td className="py-4 px-6">
            <button
              className="text-green-600 hover:text-green-800 font-medium"
              onClick={() =>
                router.push(`/dashboard/users/service-workers/${user.id}`)
              }
            >
              รายละเอียด
            </button>
          </td>
        </tr>
      );
    } else {
      // user.type === 'หอพัก'
      return (
        <tr
          key={user.id}
          className="border-b border-gray-200 hover:bg-gray-50 transition"
        >
          <td className="py-4 px-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="font-medium text-gray-800">{user.name}</div>
                <div className="text-sm text-gray-500">ID: {user.id}</div>
              </div>
            </div>
          </td>
          <td className="py-4 px-6">
            <div className="flex items-center gap-2">
              {getTypeIcon(user.type)}
              {getTypeBadge(user.type)}
            </div>
          </td>
          <td className="py-4 px-6">
            <div className="text-gray-800">{user.owner_name}</div>
            <div className="text-sm text-gray-500">{user.owner_tel}</div>
          </td>
          <td className="py-4 px-6">
            <div className="text-gray-800">
              {user.district}, {user.city}
            </div>
            <div className="text-sm text-gray-500">{user.province}</div>
          </td>
          <td className="py-4 px-6">
            <button
              className="text-purple-600 hover:text-purple-800 font-medium"
              onClick={() => router.push(`/dashboard/dorms/${user.id}`)}
            >
              รายละเอียด
            </button>
          </td>
        </tr>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            จัดการบัญชีผู้ใช้งาน
          </h1>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ค้นหาด้วยชื่อ คณะ สาขา เมือง ..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setFilterType("ทั้งหมด")}
                className={`px-4 py-3 rounded-lg font-medium transition ${
                  filterType === "ทั้งหมด"
                    ? "bg-gray-800 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                ทั้งหมด ({allUsers.length})
              </button>
              <button
                onClick={() => setFilterType("นิสิต")}
                className={`px-4 py-3 rounded-lg font-medium transition flex items-center gap-2 ${
                  filterType === "นิสิต"
                    ? "bg-blue-600 text-white"
                    : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                นิสิต ({allUsers.filter(user => user.type === "นิสิต").length})
              </button>
              <button
                onClick={() => setFilterType("คนรับจ้าง")}
                className={`px-4 py-3 rounded-lg font-medium transition flex items-center gap-2 ${
                  filterType === "คนรับจ้าง"
                    ? "bg-green-600 text-white"
                    : "bg-green-50 text-green-700 hover:bg-green-100"
                }`}
              >
                <Briefcase className="w-4 h-4" />
                คนรับจ้าง (
                {allUsers.filter(user => user.type === "คนรับจ้าง").length})
              </button>
              <button
                onClick={() => setFilterType("หอพัก")}
                className={`px-4 py-3 rounded-lg font-medium transition flex items-center gap-2 ${
                  filterType === "หอพัก"
                    ? "bg-purple-600 text-white"
                    : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                }`}
              >
                <Building2 className="w-4 h-4" />
                หอพัก ({allUsers.filter(user => user.type === "หอพัก").length})
              </button>
            </div>
          </div>

          <div className="text-sm text-gray-600 mb-4">
            แสดงผลลัพธ์ {filteredUsers.length} / {allUsers.length}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                    User
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                    Type
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                    Details
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                    Info
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>{filteredUsers.map(user => renderTableRow(user))}</tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              <Filter className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>ไม่พบผู้ใช้งาน</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllUsersList;
