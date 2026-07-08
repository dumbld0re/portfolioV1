import { LayoutWrapper } from "@/components/layout-wrapper"
import { PostsSection } from "@/components/sections/posts-section"
import { getAllPosts } from "@/lib/posts"

export default function PostsPage() {
  const posts = getAllPosts()

  return (
    <LayoutWrapper>
      <PostsSection posts={posts} />
    </LayoutWrapper>
  )
}
