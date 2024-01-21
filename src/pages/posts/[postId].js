import { useRouter } from "next/router"
import apiClient from "@/web/services/apiClient"
import { useQuery } from "@tanstack/react-query"
import withAuth from "@/web/components/hoc/withAuth"
import Loader from "@/web/components/ui/Loader"
import { formatDateTimeShort } from "@/utils/formatters"

const PostPage = () => {
  const { query } = useRouter()
  const { postId } = query
  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => apiClient.get(`posts/${postId}`),
    enabled: Boolean(postId),
  })

  if (isLoading) {
    return <Loader />
  }

  if (error) {
    return <div>Error loading the post.</div>
  }

  if (!post) {
    return <div>Post not found.</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-600">
        By {post.author ? post.author.username : "Unknown Author"}
      </p>
      <p className="text-gray-500 mb-8">
        {formatDateTimeShort(new Date(post.created_at))}
      </p>
      <div className="post-content">{post.content}</div>
    </div>
  )
}

export default withAuth(PostPage)
