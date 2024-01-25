import React, { useState } from "react"
import { Formik } from "formik"
import { object } from "yup"
import { postTitleValidator, postContentValidator } from "@/utils/validators"
import Form from "@/web/components/ui/Form"
import FormField from "@/web/components/ui/FormField"
import SubmitButton from "@/web/components/ui/SubmitButton"
import apiClient from "@/web/services/apiClient"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/router"
import { findBadWords } from "@/utils/badWordsFilter"
const initialValues = {
  title: "",
  content: "",
}
const validationSchema = object({
  title: postTitleValidator.label("Title"),
  content: postContentValidator.label("Content"),
})
const CreatePostPage = () => {
  const [errorMessage, setErrorMessage] = useState("")
  const router = useRouter()
  const { mutateAsync } = useMutation({
    mutationFn: (post) => apiClient.post("/posts", post),
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
      setErrorMessage("Error creating post. Please try again later.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Create New Post</h1>
      {errorMessage && <div className="text-red-500 mb-3">{errorMessage}</div>}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <FormField name="title" label="Title" />
          <FormField name="content" label="Content" type="textarea" />
          <SubmitButton>Create Post</SubmitButton>
        </Form>
      </Formik>
    </div>
  )
}

export default CreatePostPage
