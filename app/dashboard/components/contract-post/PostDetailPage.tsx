import Link from "next/link";
import { ContractPost } from "../../lib/types";

type PostDetailPageProps = {
  post: ContractPost;
};

export default function PostDetailPage({ post }: PostDetailPageProps) {
  return (
    <div className="container py-5 max-w-2xl mx-auto space-y-5">
        <div>
            {/* back to posts */}
            <Link
                href="/dashboard/posts"
                className="inline-block text-sm text-green-600 hover:underline"
            >
            ← กลับไปหน้ารวมโพสต์
            </Link>
        </div>
    <hr />

      {/* Title */}
      <h1 className="text-2xl font-bold">
        {post.title}
      </h1>

      {/* Price */}
      <p className="text-2xl font-semibold text-green-600">
        ฿{post.price.toLocaleString()} / เดือน
      </p>

      {/* Address */}
      <p className="text-gray-500">
        📍 {post.street}, {post.district}, {post.city},{" "}
        {post.province} {post.postalCode}
      </p>

      {/* Card */}
      <div className="border rounded-lg p-5 space-y-3">
        <p>
          <strong>เลขห้อง:</strong> {post.dorm_number}
        </p>

        <p>
          <strong>รายละเอียด:</strong> {post.detail}
        </p>

        <p>
          <strong>สถานะ:</strong>{" "}
          {post.status === "อนุมัติแล้ว"
            ? <span className="text-green-600">✅ อนุมัติแล้ว</span>
            : <span className="text-yellow-600">⏳ รออนุมัติ</span>}
        </p>

        <p className="text-sm text-gray-400">
          โพสต์เมื่อ {post.createdAt}
        </p>
      </div>
    </div>
  );
}
