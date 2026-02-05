"use client";

import { DollarSign, Building2, FileCheck, HeartHandshake } from "lucide-react";
import { useEffect, useState } from "react";
import { getDorms } from "../lib/db/dorms/queries";
import { DormListProps } from "../lib/types";
import { get100Posts } from "../posts/action";
import { toast } from "react-toastify";
import { Post } from "./posts-tab";

interface ServicesType {
  id: string;
  created_at?: string;
  name: string;
}

function DashboardStats() {
  const [dorms, setDorms] = useState<DormListProps[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [serviceWorkers, setServiceWorker] = useState<ServicesType[]>([]);
  const [lastIndexCreatedAt, setLastIndexCreatedAt] = useState<
    string | undefined
  >(undefined);
  const [loading, setLoading] = useState(true);

  const fetchService = async () => {
    try {
      const res = await fetch("/api/service-workers", { method: "GET" });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setServiceWorker(data);
    } catch (error) {
      console.error(error);
      toast.error("โหลดข้อมูลไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  const fetch100Posts = async () => {
    try {
      setLoading(true);
      const data = await get100Posts(lastIndexCreatedAt);

      setPosts(prevPosts => {
        const newPosts = data.filter(d => !prevPosts.some(p => p.id === d.id));
        return [...prevPosts, ...newPosts];
      });

      if (data.length > 0) {
        setLastIndexCreatedAt(data[data.length - 1].created_at);
      } else {
        setLastIndexCreatedAt(undefined);
      }
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาดในการดึงข้อมูลโพสต์");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDorms()
      .then((data: DormListProps[]) => {
        setDorms(data);
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });

    fetch100Posts();

    fetchService();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">รายได้รวม/เดือน</p>
              <p className="text-2xl font-bold text-gray-900 ">
                {loading
                  ? ""
                  : (
                      (dorms.length + serviceWorkers.length) *
                      300
                    ).toLocaleString("th-TH")}
              </p>
            </div>
            <DollarSign className="text-green-600" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">หอพักทั้งหมด</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? "" : dorms.length}
              </p>
            </div>
            <Building2 className="text-blue-600" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">โพสต์รออนุมัติ</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading
                  ? ""
                  : posts.filter(post => post.status === "pending").length}
              </p>
            </div>
            <FileCheck className="text-orange-600" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                พนักงานบริการรับจ้างทั้งหมด
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? "" : serviceWorkers.length}
              </p>
            </div>
            <HeartHandshake className="text-orange-600" size={32} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardStats;
