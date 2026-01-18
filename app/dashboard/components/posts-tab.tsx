import { Eye, Check, X } from "lucide-react";

const pendingPosts = [
  {
    id: 1,
    user: "สมชาย ใจดี",
    type: "ขายสัญญา",
    dorm: "หอพักอินดี้",
    price: "8,500",
    date: "2025-01-18",
  },
  {
    id: 2,
    user: "วิภา สุขใจ",
    type: "ขายสัญญา",
    dorm: "ยูนิค เพลส",
    price: "6,000",
    date: "2025-01-17",
  },
  {
    id: 3,
    user: "ธนา รุ่งเรือง",
    type: "รับซื้อสัญญา",
    dorm: "เดอะ นิช",
    price: "7,500",
    date: "2025-01-17",
  },
];

type Props = {
  activeTab: string;
};

function PostsTab({ activeTab }: Props) {
  return (
    <div>
      {activeTab === "approval" && (
        <div>
          <div className="mb-4">
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
                ทั้งหมด (3)
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">
                ขายสัญญา (2)
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">
                รับซื้อสัญญา (1)
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">
                อนุมัติแล้ว (10)
              </button>
            </div>
          </div>

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
                        {post.type}
                      </span>
                      <span className="text-sm text-gray-500">{post.date}</span>
                    </div>
                    <h3 className="font-medium text-lg mb-1">{post.dorm}</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      โพสต์โดย: {post.user}
                    </p>
                    <p className="text-xl font-bold text-blue-600">
                      ฿{post.price}/เดือน
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-blue-50 rounded-lg text-blue-600">
                      <Eye size={20} />
                    </button>
                    <button className="p-2 hover:bg-green-50 rounded-lg text-green-600">
                      <Check size={20} />
                    </button>
                    <button className="p-2 hover:bg-red-50 rounded-lg text-red-600">
                      <X size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PostsTab;
