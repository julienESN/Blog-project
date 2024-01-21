import React from "react"
import { useQuery } from "@tanstack/react-query"
import apiClient from "@/web/services/apiClient"
import { useSession } from "@/web/components/SessionContext"
import Loader from "@/web/components/ui/Loader"
import PostItem from "@/web/components/PostItem"
import withAuth from "@/web/components/hoc/withAuth"

const UserPostsPage = () => {
  const { session } = useSession()
  const userId = session?.id
  const isSessionAvailable = Boolean(userId)
  const fetchUserPosts = () => apiClient.get(`/posts`, { params: { userId } })
  const {
    data: posts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userPosts", userId],
    queryFn: fetchUserPosts,
    enabled: isSessionAvailable,
  })

  if (isLoading) {
    return <Loader />
  }

  if (error || !posts || !Array.isArray(posts.result)) {
    return <div>Error loading posts or no posts found.</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">My Posts</h1>
      {posts.result.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  )
}

export default withAuth(UserPostsPage)
