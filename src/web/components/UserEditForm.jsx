import React, { useState } from "react"
import { Formik, Form, Field } from "formik"
import * as Yup from "yup"
import FormField from "@/web/components/ui/FormField"
import SubmitButton from "@/web/components/ui/SubmitButton"
import ErrorMessage from "@/web/components/ui/ErrorMessage"
import apiClient from "@/web/services/apiClient"
import { useMutation } from "@tanstack/react-query"
import {
  usernameValidator,
  emailValidator,
  isActiveValidator,
} from "@/utils/validators"

const validationSchema = Yup.object().shape({
  username: usernameValidator,
  email: emailValidator,
  isActive: isActiveValidator,
})
const UserEditForm = ({ user, onClose }) => {
  const [formError, setFormError] = useState(null)
  const updateUserMutation = useMutation({
    mutationFn: (updatedUser) =>
      apiClient.put(`/users/${user.id}?userId=${user.id}`, updatedUser),
    onSuccess: () => {
      onClose()
    },
    onError: (error) => {
      if (error.response?.data?.error) {
        setFormError(error.response.data.error)
      } else {
        setFormError("An unexpected error occurred.")
      }
    },
  })
  const handleSubmit = (values) => {
    setFormError(null)
    updateUserMutation.mutate(values)
  }

  return (
    <div className="user-edit-form">
      <Formik
        initialValues={{
          username: user.username,
          email: user.email,
          isActive: user.isActive,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <FormField name="username" label="Username" />
            <FormField name="email" label="Email" />
            <div>
              <label htmlFor="isActive">Active User:</label>
              <Field type="checkbox" name="isActive" />
            </div>
            {formError && <ErrorMessage error={formError} />}
            <SubmitButton disabled={isSubmitting}>Update User</SubmitButton>
          </Form>
        )}
      </Formik>
      <button onClick={onClose}>Cancel</button>
    </div>
  )
}

export default UserEditForm
