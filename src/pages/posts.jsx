import React from "react"
import { useQuery } from "@tanstack/react-query"
import apiClient from "@/web/services/apiClient"
import { useSession } from "@/web/components/SessionContext"
import Loader from "@/web/components/ui/Loader"
import PostItem from "@/web/components/PostItem"
import Link from "next/link"
import withAuth from "@/web/components/hoc/withAuth"

const UserPostsPage = () => {
  const { session } = useSession()
  const userId = session?.id
  const isSessionAvailable = Boolean(userId)
  const fetchUserPosts = () =>
    apiClient.get(`/posts/user`, { params: { userId } })
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

  if (error) {
    return <div>Failed to load posts. Please try again later.</div>
  }

  if (posts && posts.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">My Posts</h1>
        <p>
          You don't have any posts yet.{" "}
          <Link href="/posts/create">
            <p className="text-blue-500 hover:text-blue-700">
              Create your first post
            </p>
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">My Posts</h1>
      {Array.isArray(posts) &&
        posts.map((post) => <PostItem key={post.id} post={post} />)}
    </div>
  )
}

export default withAuth(UserPostsPage)
