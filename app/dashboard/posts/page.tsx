"use client";

import PostCard from "../components/contract-post/PostCard";
import { mockContractPosts } from "../lib/mock/mockContractPosts";

export default function PostHomePage() {
   const sortedPosts = [...mockContractPosts]
    .filter(post => post.status === "อนุมัติแล้ว")
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  return (
    <div className="container mx-auto p-6 space-y-6 ">
      {/* Page Title */}
      <h1 className="text-2xl font-bold">
        โพสต์ขายสัญญาหอพัก
      </h1>

      {/* Posts */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedPosts.map((post) => (
        <PostCard key={post.contract_posts_id} post={post} />
      ))}
      </section>
    </div>
  );
}
