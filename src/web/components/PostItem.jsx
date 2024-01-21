import React from "react"
import Link from "next/link"

const PostItem = ({ post }) => (
  <div className="border-b p-4 flex justify-between items-center">
    <div>
      <h2 className="text-xl font-bold">{post.title}</h2>
      <p className="text-gray-600">{post.content}</p>
    </div>
    <Link href={`/posts/${post.id}`}>Go to post</Link>
    <Link href={`/posts/${post.id}/edit`}>Edit post</Link>
  </div>
)

export default PostItem
