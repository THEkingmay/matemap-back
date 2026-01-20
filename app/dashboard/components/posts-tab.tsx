import PendingPostTab from "./pendding-post-tab";
import { useState } from "react";
import ApprovedPostTab from "./approved-post-tab";
import { Button } from "@/components/ui/button";

const pendingPosts = [
  {
    id: "1",
    post_by: "สมชาย ใจดี",
    title: "หอพักอินดี้",
    price: 8500,
    createdAt: "2025-01-18",
    status: "รอการอนุมัติ",
  },
  {
    id: "2",
    post_by: "วิภา สุขใจ",
    title: "ยูนิค เพลส",
    price: 6000,
    createdAt: "2025-01-17",
    status: "รอการอนุมัติ",
  },
];

const approvedPosts = [
  {
    id: "3",
    post_by: "ธนา รุ่งเรือง",
    title: "เดอะ นิช",
    price: 7500,
    createdAt: "2025-01-17",
    status: "รออนุมัติ",
  },
  {
    id: "4",
    post_by: "ธนา รุ่งเรือง",
    title: "เดอะ นิช",
    price: 8000,
    createdAt: "2025-01-17",
    status: "อนุมัติแล้ว",
  },
];

type Props = {
  activeTab: string;
};

function PostsTab({ activeTab }: Props) {
  const [activeSubTab, setActiveSubTab] = useState("pending");

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
              <Button
                onClick={() => setActiveSubTab("approved")}
                className={`px-6 py-3 font-medium hover:cursor-pointer ${activeSubTab === "approved" ? "px-4 py-2 bg-blue-600 text-white rounded-lg text-sm" : "px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"}`}
              >
                อนุมัติแล้ว ({approvedPosts.length})
              </Button>
            </div>
          </div>

          <PendingPostTab
            pendingPosts={pendingPosts}
            activeSubTab={activeSubTab}
          />

          <ApprovedPostTab
            approvedPosts={approvedPosts}
            activeSubTab={activeSubTab}
          />
        </div>
      )}
    </div>
  );
}

export default PostsTab;
