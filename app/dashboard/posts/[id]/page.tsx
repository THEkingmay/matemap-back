import { mockContractPosts } from "../../lib/mock/mockContractPosts";
import PostDetailPage from "../../components/contract-post/PostDetailPage";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PostDetailRoute({ params }: Props) {
  const { id } = await params;

  const post = mockContractPosts.find(
    (item) => item.contract_posts_id === id
  );

  console.log("Post Detail Params ID:", id);
  console.log("Found Post:", post);

  if (!post) {
    return <div>ไม่พบโพสต์นี้</div>;
  }

  return <PostDetailPage post={post} />;
}
