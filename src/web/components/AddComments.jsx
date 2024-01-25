import React, { useState } from "react"
import { commentContentValidator } from "@/utils/validators"

const AddComment = ({ onAddComment }) => {
  const [content, setContent] = useState("")
  const [error, setError] = useState("")
  const validateComment = () => {
    try {
      commentContentValidator.validateSync(content)
      setError("")

      return true
    } catch (validationError) {
      setError(validationError.message)

      return false
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateComment()) {
      onAddComment(content)
      setContent("")
    }
  }

  return (
    <div className="mt-6 bg-white p-4 shadow rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Add a Comment</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your comment here..."
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Post Comment
        </button>
      </form>
    </div>
  )
}

export default AddComment
