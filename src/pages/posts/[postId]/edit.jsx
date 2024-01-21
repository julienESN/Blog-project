import React, { useState } from "react"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@tanstack/react-query"
import apiClient from "@/web/services/apiClient"
import Loader from "@/web/components/ui/Loader"
import Form from "@/web/components/ui/Form"
import FormField from "@/web/components/ui/FormField"
import SubmitButton from "@/web/components/ui/SubmitButton"
import { Formik } from "formik"
import withAuth from "@/web/components/hoc/withAuth"
import { postTitleValidator, postContentValidator } from "@/utils/validators"
import { object } from "yup"
import badWordsData from "@/utils/bannedWords.json"

const findBadWords = (text) =>
  badWordsData.RECORDS.reduce((acc, wordData) => {
    if (text.includes(wordData.word)) {
      acc.push(wordData.word)
    }

    return acc
  }, [])
const EditPostForm = ({ post, onSubmit, isUpdating }) => (
  <Formik
    initialValues={{ title: post.title, content: post.content }}
    validationSchema={object({
      title: postTitleValidator.label("Title"),
      content: postContentValidator.label("Content"),
    })}
    onSubmit={onSubmit}
  >
    <Form>
      <FormField name="title" label="Title" />
      <FormField name="content" label="Content" type="textarea" />
      <SubmitButton disabled={isUpdating}>Update Post</SubmitButton>
    </Form>
  </Formik>
)
const EditPostPage = () => {
  const [errorMessage, setErrorMessage] = useState("")
  const router = useRouter()
  const { postId } = router.query
  const { data: post } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => apiClient.get(`/posts/${postId}`),
    enabled: Boolean(postId),
  })
  const { mutateAsync, isLoading: isUpdating } = useMutation({
    mutationFn: (updatedPost) =>
      apiClient.patch(`/posts/${postId}`, updatedPost),
  })
  const handleSubmit = async (values, { setSubmitting }) => {
    const badWordsInTitle = findBadWords(values.title)
    const badWordsInContent = findBadWords(values.content)

    if (badWordsInTitle.length > 0 || badWordsInContent.length > 0) {
      setErrorMessage(
        `Please avoid using inappropriate language. Words identified: ${[
          ...badWordsInTitle,
          ...badWordsInContent,
        ].join(", ")}`,
      )
      setSubmitting(false)

      return
    }

    try {
      await mutateAsync(values)
      router.push("/posts")
    } catch (error) {
      setErrorMessage("Error updating post. Please try again later.")
    } finally {
      setSubmitting(false)
    }
  }

  if (!post) {
    return <div>Post not found.</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Edit Post</h1>
      {errorMessage && <div className="text-red-500 mb-3">{errorMessage}</div>}
      <EditPostForm
        post={post}
        onSubmit={handleSubmit}
        isUpdating={isUpdating}
      />
    </div>
  )
}

export default withAuth(EditPostPage)
