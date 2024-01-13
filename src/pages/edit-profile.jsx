import React, { useState } from "react"
import { Formik, Form } from "formik"
import FormField from "@/web/components/ui/FormField"
import SubmitButton from "@/web/components/ui/SubmitButton"
import ErrorMessage from "@/web/components/ui/ErrorMessage"
import Alert from "@/web/components/ui/Alert"
import { useSession } from "@/web/components/SessionContext"
import withAuth from "@/web/components/hoc/withAuth"
import { usernameValidator, emailValidator } from "@/utils/validators"
import * as Yup from "yup"
import { useUpdateUser, useUserData } from "../hooks/useUserData"
const ProfileForm = ({ initialValues, onSubmit, validationSchema }) => (
  <Formik
    initialValues={initialValues}
    validationSchema={validationSchema}
    onSubmit={onSubmit}
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
)
const EditProfilePage = () => {
  const { session, saveSessionToken } = useSession()
  const [alert, setAlert] = useState(null)
  const userData = useUserData(session)
  const handleSubmit = useUpdateUser(session, setAlert)
  const initialValues = {
    username: userData.username,
    email: userData.email,
  }
  const validationSchema = Yup.object({
    username: usernameValidator,
    email: emailValidator,
  })

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
      <ProfileForm
        initialValues={initialValues}
        onSubmit={(values, actions) =>
          handleSubmit(values, actions, saveSessionToken)
        }
        validationSchema={validationSchema}
      />
    </div>
  )
}

export default withAuth(EditProfilePage)
