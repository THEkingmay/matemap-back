import { Phone, Calendar, GraduationCap, Building2, Tag } from "lucide-react";
import { UserDetails } from "../../lib/types";

export default function UserDetailPage({
  userData,
}: {
  userData: UserDetails;
}) {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-linear-to-b from-white to-gray-400 h-32"></div>

          <div className="px-8 pb-8">
            {/* Profile Image & Name */}
            <div className="flex items-end gap-6 -mt-16 mb-6">
              <div className="relative">
                <img
                  src={
                    userData.image_url ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${userData.name[0]}`
                  }
                  alt={userData.name}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
              </div>
              <div className="mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {userData.name}
                </h1>
              </div>
            </div>

            {/* Bio Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                เกี่ยวกับ
              </h2>
              <p className="text-gray-600">{userData.bio || "ไม่พบข้อมูล"}</p>
            </div>

            {/* Tags Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Tag size={20} />
                ความสนใจ
              </h2>
              <div className="flex flex-wrap gap-2">
                {userData.tag?.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Faculty */}
              <div className="flex items-start gap-3">
                <Building2 className="text-blue-600 mt-1" size={20} />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">คณะ</p>
                  <p className="font-medium text-gray-900">
                    {userData.faculty || "ไม่พบข้อมูล"}
                  </p>
                </div>
              </div>

              {/* Major */}
              <div className="flex items-start gap-3">
                <GraduationCap className="text-blue-600 mt-1" size={20} />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">สาขา</p>
                  <p className="font-medium text-gray-900">
                    {userData.major || "ไม่พบข้อมูล"}
                  </p>
                </div>
              </div>

              {/* Birth Year */}
              <div className="flex items-start gap-3">
                <Calendar className="text-blue-600 mt-1" size={20} />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">ปีเกิด</p>
                  <p className="font-medium text-gray-900">
                    {userData.birth_year || "ไม่พบข้อมูล"}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <Phone className="text-blue-600 mt-1" size={20} />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">เบอร์โทร</p>
                  <p className="font-medium text-gray-900">
                    {userData.tel || "ไม่พบข้อมูล"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
