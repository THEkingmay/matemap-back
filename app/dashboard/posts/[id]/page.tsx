'use client';

import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { getPostByID, updateStatusPost } from "../action";
import { Post } from "../../components/posts-tab";
import Link from "next/link";

type PostAndOwner = {
  post: Post;
  owner: {
    id: string;
    name: string;
    bio?: string;
    tag?: string[];
    image_url?: string;
    faculty?: string;
    major?: string;
    birth_year?: number;
    tel?: string;
  }
}

// --- Helper Components & Functions ---

// 1. Badge for Status
const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    approved: "bg-green-50 text-green-700 border-green-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
  };
  
  const label = {
    pending: "รอการตรวจสอบ",
    approved: "อนุมัติแล้ว",
    rejected: "ถูกปฏิเสธ",
  };

  const currentStyle = styles[status as keyof typeof styles] || "bg-gray-50 text-gray-600 border-gray-200";
  const currentLabel = label[status as keyof typeof label] || status;

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${currentStyle}`}>
      {currentLabel}
    </span>
  );
};

// 2. Address Formatter
const formatAddress = (p: Post) => {
  const parts = [
    p.dorm_number ? `หอพัก ${p.dorm_number}` : '',
    p.street,
    p.sub_district,
    p.district,
    p.province,
    p.postal_code
  ];
  return parts.filter(Boolean).join(", ");
};

export default function PostDetailRoute() {
  const { id } = useParams();
  const [postAndOwner, setPostAndOwner] = useState<PostAndOwner | null>(null);
  const [loading, setLoading] = useState(true); // Added loading state for better UX

  const fetchPostAndOwner = async () => {
    try {
      if (typeof id !== 'string') return;
      setLoading(true);
      const data = await getPostByID(id);
      setPostAndOwner({
        post: data.post,
        owner: data.owner
      });
    } catch (error) {
      console.error(error);
      toast.error("ไม่สามารถดึงข้อมูลโพสต์ได้");
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateStatus = async (status: "approved" | "rejected") => {
    if (!postAndOwner) return;
    
    // Optimistic UI Update prevention (optional) or loading state on buttons could go here
    try {
      await toast.promise(
        updateStatusPost(id as string, status),
        { 
          pending: 'กำลังอัปเดตสถานะ...',
          success: `สถานะเปลี่ยนเป็น ${status === 'approved' ? 'อนุมัติ' : 'ปฏิเสธ'} แล้ว`,
          error: 'เกิดข้อผิดพลาด'
        }
      );

      setPostAndOwner(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          post: { ...prev.post, status: status }
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchPostAndOwner();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400 font-light animate-pulse">
        กำลังโหลดข้อมูล...
      </div>
    );
  }

  if (!postAndOwner) return <div className="text-center mt-10 text-gray-500">ไม่พบข้อมูล</div>;

  const { post, owner } = postAndOwner;

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{post.title}</h1>
            <p className="text-sm text-gray-500 mt-1">
              ลงประกาศเมื่อ: {new Date(post.created_at).toLocaleDateString('th-TH')}
            </p>
          </div>
          <StatusBadge status={post.status} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Main Content (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Image Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden aspect-video relative group">
              {post.image_url ? (
                <img 
                  src={post.image_url} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                  ไม่มีรูปภาพ
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2">รายละเอียด</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">ราคา</p>
                  <p className="text-2xl font-bold text-indigo-600">฿{post.price.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">ที่อยู่ / สถานที่</p>
                  <p className="text-gray-700 leading-relaxed">{formatAddress(post) || "-"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar (1/3 width) */}
          <div className="space-y-6">
            
            {/* Owner Card */}
            <Link href={`/dashboard/users/students/${owner.id}`}>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-3">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">ข้อมูลผู้ประกาศ</h3>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
                  {owner.image_url ? (
                    <img src={owner.image_url} alt={owner.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl text-gray-400 font-bold">
                      {owner.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{owner.name}</p>
                  <p className="text-sm text-gray-500">{owner.faculty ?? '-'} / {owner.major ?? '-'}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span>เบอร์โทรศัพท์</span>
                  <span className="font-medium text-gray-900">{owner.tel || "-"}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                   <span>Bio</span>
                   <span className="font-medium text-gray-900 text-right truncate max-w-[150px]">{owner.bio || "-"}</span>
                </div>
              </div>
            </div></Link>

            {/* Admin Actions Panel */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">การจัดการ</h3>
              <p className="text-xs text-gray-400 mb-4">โปรดตรวจสอบข้อมูลให้ครบถ้วนก่อนทำการอนุมัติโพสต์นี้</p>
              
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => handleUpdateStatus("approved")}
                  disabled={post.status === 'approved'}
                  className={`w-full py-2.5 px-4 rounded-xl font-medium transition-all duration-200 
                    ${post.status === 'approved' 
                      ? 'bg-green-100 text-green-700 cursor-default' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg hover:-translate-y-0.5'
                    }`}
                >
                  {post.status === 'approved' ? 'อนุมัติแล้ว' : 'อนุมัติโพสต์ (Approve)'}
                </button>

                <button
                  onClick={() => handleUpdateStatus("rejected")}
                  disabled={post.status === 'rejected'}
                  className={`w-full py-2.5 px-4 rounded-xl font-medium transition-all duration-200
                    ${post.status === 'rejected'
                      ? 'bg-red-100 text-red-700 cursor-default'
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
                    }`}
                >
                  {post.status === 'rejected' ? 'ถูกปฏิเสธแล้ว' : 'ปฏิเสธ (Reject)'}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}