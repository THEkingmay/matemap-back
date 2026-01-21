"use client";

import { useRouter } from "next/navigation";
import { ContractPost } from "../../lib/types";

type PostCardProps = {
  post: ContractPost;
};

export default function PostCard({ post }: PostCardProps) {
  const router = useRouter();

  const handleGoDetail = () => {
    router.push(`/dashboard/posts/${post.contract_posts_id}`);
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm p-5 space-y-3 flex flex-col justify-between">
      {/* Content */}
      <div className="space-y-2">
        <h2 className="text-lg font-bold line-clamp-1">
          {post.title}
        </h2>

        <p className="text-xl font-semibold text-green-600">
          ฿{post.price.toLocaleString()} / เดือน
        </p>

        <p className="text-sm text-gray-500">
          📍 {post.district}, {post.city}, {post.province}
        </p>

        <p className="text-sm">
          🏠 ห้อง {post.dorm_number}
        </p>

        <p className="text-sm text-gray-600 line-clamp-2">
          {post.detail}
        </p>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-3">
        <span className="text-xs text-gray-400">
          {post.createdAt}
        </span>

        <span
          className={`text-xs font-medium ${
            post.status === "อนุมัติแล้ว"
              ? "text-green-600"
              : "text-yellow-600"
          }`}
        >
          {post.status === "อนุมัติแล้ว"
            ? "✅ อนุมัติแล้ว"
            : "⏳ รออนุมัติ"}
        </span>
      </div>

      {/* Action */}
      <button
        onClick={handleGoDetail}
        className="mt-4 w-full rounded-lg bg-green-600 text-white py-2 text-sm font-medium hover:bg-green-700 transition"
      >
        ดูรายละเอียด
      </button>
    </div>
  );
}
