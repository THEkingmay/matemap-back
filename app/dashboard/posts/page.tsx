"use client";

import { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import { get100Posts } from "./action";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, Tag, Loader2 } from "lucide-react";
import { Post } from "../components/posts-tab";

// กำหนด Label ภาษาไทยสำหรับ Status
const STATUS_LABELS = {
  all: "ทั้งหมด",
  pending: "รอตรวจสอบ",
  approved: "อนุมัติแล้ว",
  rejected: "ปฏิเสธ",
};

export default function PostHomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [lastIndexCreatedAt, setLastIndexCreatedAt] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<keyof typeof STATUS_LABELS>("all");

  const fetch100Posts = async () => {
    try {
      setLoading(true);
      const data = await get100Posts(lastIndexCreatedAt);
      
      setPosts((prevPosts) => {
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
    fetch100Posts();
  }, []);

  const filteredPosts = useMemo(() => {
    if (filterStatus === "all") return posts;
    return posts.filter((post) => post.status === filterStatus);
  }, [posts, filterStatus]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-amber-100 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* ส่วนหัวข้อ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">รายการประกาศ</h1>
          <p className="text-sm text-gray-500 mt-1">จัดการและตรวจสอบสถานะโพสต์ทั้งหมดในระบบ</p>
        </div>

        {/* ปุ่มกรองสถานะ */}
        <div className="flex p-1 bg-gray-100 rounded-lg self-start md:self-auto overflow-x-auto">
          {(Object.keys(STATUS_LABELS) as Array<keyof typeof STATUS_LABELS>).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap ${
                filterStatus === status
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
              }`}
            >
              {STATUS_LABELS[status]}
            </button>
          ))}
        </div>
      </div>

      {/* รายการโพสต์แบบ Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPosts.map((post) => (
          <Link 
            href={`/dashboard/posts/${post.id}`} 
            key={post.id}
            className="group block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="relative h-48 w-full bg-gray-100">
              {post.image_url ? (
                <Image
                  src={post.image_url}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <span className="text-sm italic">ไม่มีรูปภาพ</span>
                </div>
              )}
              {/* Badge สถานะภาษาไทย */}
              <div className="absolute top-3 right-3">
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(post.status)} shadow-sm`}>
                  {STATUS_LABELS[post.status as keyof typeof STATUS_LABELS] || post.status}
                </span>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>
                <div className="flex items-center text-gray-500 text-xs mt-1 space-x-2">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(post.created_at).toLocaleDateString("th-TH", {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
              </div>

              <div className="flex items-baseline">
                <span className="text-xl font-bold text-blue-600">
                  ฿{post.price.toLocaleString()}
                </span>
              </div>

              {(post.province || post.district) && (
                <div className="flex items-start text-gray-500 text-sm pt-2 border-t border-gray-100">
                  <MapPin className="w-4 h-4 mr-1 flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-1">
                    {post.district} {post.province}
                  </span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* กรณีไม่มีข้อมูล */}
      {!loading && filteredPosts.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <Tag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900">ไม่พบประกาศ</h3>
          <p className="text-gray-500 text-sm">ลองเปลี่ยนหมวดหมู่หรือตัวกรองสถานะ</p>
        </div>
      )}

      {/* ปุ่มโหลดเพิ่ม */}
      <div className="flex justify-center pt-6">
        {lastIndexCreatedAt ? (
          <button
            onClick={fetch100Posts}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "กำลังโหลด..." : "โหลดเพิ่มเติม"}
          </button>
        ) : (
          !loading && posts.length > 0 && (
            <span className="text-sm text-gray-400">แสดงรายการทั้งหมดแล้ว</span>
          )
        )}
      </div>
    </div>
  );
}