import React from "react"
import { useRouter } from "next/router"
import apiClient from "@/web/services/apiClient"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import withAuth from "@/web/components/hoc/withAuth"
import Loader from "@/web/components/ui/Loader"
import { formatDateTimeShort } from "@/utils/formatters"
import CommentsList from "@/web/components/CommentsList"
import AddComment from "@/web/components/AddComments"

const useAddCommentMutation = (postId, onSuccess) =>
  useMutation({
    mutationFn: (commentData) =>
      apiClient.post(`/posts/${postId}/comments`, commentData),
    onSuccess,
  })
const PostPage = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { postId } = router.query
  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => apiClient.get(`posts/${postId}`),
    enabled: Boolean(postId),
  })
  const addCommentMutation = useAddCommentMutation(postId, () => {
    queryClient.invalidateQueries(["post", postId])
  })
  const handleAddComment = (content) => {
    const commentData = { content, postId }
    addCommentMutation.mutate(commentData)
  }

  if (isLoading) {
    return <Loader />
  }

  if (error) {
    return <div className="error-message">Error loading the post.</div>
  }

  if (!post) {
    return <div className="not-found-message">Post not found.</div>
  }

  return (
    <div className="post-container">
      <PostHeader post={post} />
      <PostContent post={post} />
      <CommentsList comments={post.comments} />
      <AddComment onAddComment={handleAddComment} />
    </div>
  )
}
const PostHeader = ({ post }) => (
  <div className="post-header">
    <h1 className="post-title">{post.title}</h1>
    <p className="post-info">
      Posted by{" "}
      <span className="author">
        {post.author ? post.author.username : "Unknown Author"}
      </span>{" "}
      on {formatDateTimeShort(new Date(post.created_at))}
    </p>
  </div>
)
const PostContent = ({ post }) => (
  <div className="post-content">{post.content}</div>
)

export default withAuth(PostPage)
