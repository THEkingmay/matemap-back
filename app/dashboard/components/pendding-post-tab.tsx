import { Eye, Check, X } from "lucide-react";
import { PendingPost } from "../lib/types";
import Link from "next/link";
import PostDisapproveAlert from "./post-disaprrove-alert";
import PostApproveAlert from "./post-approve-alert";

type PendingPostProps = {
  pendingPosts: PendingPost[];
  activeSubTab: string;
};

function PendingPostTab({ pendingPosts, activeSubTab }: PendingPostProps) {
  return (
    <div>
      {activeSubTab === "pending" && (
        <div className="space-y-4">
          {pendingPosts.map(post => (
            <div
              key={post.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                      ขายสัญญา
                    </span>
                    <span className="text-sm text-gray-500">
                      {post.createdAt}
                    </span>
                  </div>
                  <h3 className="font-medium text-lg mb-1">{post.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    โพสต์โดย: {post.post_by}
                  </p>
                  <p className="text-xl font-bold text-blue-600">
                    ฿{post.price.toLocaleString("th-TH")}/เดือน
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-blue-50 rounded-lg text-blue-600">
                    <Link href={`/dashboard/posts/${post.id}`}>
                      <Eye size={20} />
                    </Link>
                  </button>
                  <PostApproveAlert postID={post.id} />
                  <PostDisapproveAlert postID={post.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PendingPostTab;
