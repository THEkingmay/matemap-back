import PendingPostTab from "./pendding-post-tab";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { getPostsByStatus } from "../posts/action";
//   image_public_id text,

export interface Post {
  id: string;
  created_at: string;
  user_id: string;
  title: string;
  price: number;
  dorm_number?: string;
  postal_code?: string;
  province?: string;
  city?: string;
  district?: string;
  sub_district?: string;
  street?: string;
  status: "pending" | "approved" | "rejected";
  image_url?: string;
  image_public_id?: string;
}

type Props = {
  activeTab: string;
};

function PostsTab({ activeTab }: Props) {
  const [activeSubTab, setActiveSubTab] = useState("pending");
  const [pendingPosts, setPendingPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPendingPosts = async () => {
    try {
      setLoading(true);
      const data = await getPostsByStatus("pending");
      setPendingPosts(data);
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการดึงโพสต์ที่รอการอนุมัติ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "approval") {
      fetchPendingPosts();
    }
  }, [activeTab]);

  return (
    <div>
      {activeTab === "approval" && (
        <div>
          <div className="mb-4">
            <div className="flex gap-2">
              <Button
                onClick={() => setActiveSubTab("pending")}
                className={`px-6 py-3 font-medium hover:cursor-pointer ${activeSubTab === "pending" ? "px-4 py-2 bg-blue-600 text-white rounded-lg text-sm" : "px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"}`}
              >
                รอการอนุมัติ ({pendingPosts.length})
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <PendingPostTab
              pendingPosts={pendingPosts}
              activeSubTab={activeSubTab}
              setPendingPosts={setPendingPosts}
            />
          )}

        </div>
      )}
    </div>
  );
}

export default PostsTab;
