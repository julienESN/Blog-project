import React from "react"

const CommentsList = ({ comments }) => (
  <div className="mt-5 border-t border-gray-300 pt-5">
    <h3 className="text-lg font-semibold text-gray-800 mb-3">Comments</h3>
    {comments.length > 0 ? (
      comments.map((comment) => (
        <div key={comment.id} className="mb-4 pb-4 border-b border-gray-200">
          <div className="text-sm text-gray-600 mb-1">
            Posted by:{" "}
            <span className="font-medium">{comment.user.username}</span>
          </div>
          <div className="text-gray-700">{comment.content}</div>
        </div>
      ))
    ) : (
      <p className="text-gray-600">No comments yet.</p>
    )}
  </div>
)

export default CommentsList
