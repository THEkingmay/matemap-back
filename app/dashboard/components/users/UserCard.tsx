import { Calendar, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface UserDetail {
  id: string;
  name: string;
  age?: number;
  faculty?: string;
  major?: string;
  tags?: string[];
  image_url?: string;
}

interface UserCardProps {
  user: UserDetail;
}

const tagColors: Record<string, string> = {
  Faculty: "bg-purple-100 text-purple-800 border-purple-200",
  Instructor: "bg-blue-100 text-blue-800 border-blue-200",
  Student: "bg-green-100 text-green-800 border-green-200",
  Developer: "bg-indigo-100 text-indigo-800 border-indigo-200",
  Designer: "bg-pink-100 text-pink-800 border-pink-200",
  Researcher: "bg-amber-100 text-amber-800 border-amber-200",
  "Research Assistant": "bg-teal-100 text-teal-800 border-teal-200",
};

export function UserCard({ user }: UserCardProps) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="p-6">
        {/* Avatar and Name Section */}
        <div className="mb-4 flex items-center gap-4">
          {user.image_url ? (
            <img
              src={user.image_url}
              alt={user.name}
              className="h-16 w-16 rounded-full object-cover ring-2 ring-gray-100"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 ring-2 ring-gray-100">
              <span className="text-xl text-gray-600">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex-1">
            <h3 className="mb-1">{user.name}</h3>
            {user.age && (
              <p className="text-sm text-gray-500">{user.age} years old</p>
            )}
          </div>
        </div>

        {/* Tags */}
        {user.tags && user.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {user.tags.map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className={tagColors[tag] || "bg-gray-100 text-gray-800"}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* User Details */}
        <div className="space-y-3 border-t border-gray-100 pt-4">
          {user.faculty && (
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Briefcase className="h-4 w-4 text-gray-400" />
              <span>{user.faculty}</span>
            </div>
          )}
          {user.major && (
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>{user.major}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
