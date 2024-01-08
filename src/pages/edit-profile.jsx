import React, { useState, useEffect } from "react"
import { Formik, Form } from "formik"
import FormField from "@/web/components/ui/FormField"
import SubmitButton from "@/web/components/ui/SubmitButton"
import ErrorMessage from "@/web/components/ui/ErrorMessage"
import Alert from "@/web/components/ui/Alert"
import { useSession } from "@/web/components/SessionContext"
import apiClient from "@/web/services/apiClient"
import withAuth from "@/web/components/hoc/withAuth"
import { usernameValidator, emailValidator } from "@/utils/validators"
import * as Yup from "yup"
import { useMutation } from "@tanstack/react-query"

const EditProfilePage = () => {
  const { session, saveSessionToken } = useSession()
  const [alert, setAlert] = useState(null)
  const [userData, setUserData] = useState({ username: "", email: "" })

  useEffect(() => {
    if (session?.id) {
      fetchUserData()
    }
  }, [session?.id])

  const fetchUserData = async () => {
    try {
      const response = await apiClient.get(`/users/${session?.id}`)
      setUserData({
        username: response.username,
        email: response.email,
      })
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }

  const initialValues = {
    username: userData.username,
    email: userData.email,
  }

  const validationSchema = Yup.object({
    username: usernameValidator,
    email: emailValidator,
  })

  const updateUserMutation = useMutation({
    mutationFn: (updatedUser) =>
      apiClient.patch(`/users/${session?.id}`, updatedUser),
  })

  const handleSubmit = async (values, actions) => {
    actions.setSubmitting(true)
    try {
      const response = await updateUserMutation.mutateAsync(values)
      setAlert({ variant: "success", message: "Profile updated successfully." })
      setTimeout(() => setAlert(null), 3000)

      if (response.jwtToken) {
        saveSessionToken(response.jwtToken, {
          username: values.username,
          email: values.email,
        })
      }

      window.location.reload()
    } catch (error) {
      setAlert({ variant: "danger", message: "Error updating profile." })
      setTimeout(() => setAlert(null), 3000)
    } finally {
      actions.setSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Edit Profile</h1>
      {alert && (
        <Alert variant={alert.variant} className="mb-4">
          {alert.message}
        </Alert>
      )}
      <p>Username: {userData.username}</p>
      <p>Email: {userData.email}</p>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, isSubmitting }) => (
          <Form>
            <FormField name="username" label="Username" />
            <FormField name="email" label="Email" />
            {errors.submit && <ErrorMessage error={errors.submit} />}
            <SubmitButton disabled={isSubmitting}>Update Profile</SubmitButton>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default withAuth(EditProfilePage)
