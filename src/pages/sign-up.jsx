import {
  emailValidator,
  passwordValidator,
  usernameValidator,
} from "@/utils/validators"
import Alert from "@/web/components/ui/Alert"
import Form from "@/web/components/ui/Form"
import FormField from "@/web/components/ui/FormField"
import Link from "@/web/components/ui/Link"
import SubmitButton from "@/web/components/ui/SubmitButton"
import apiClient from "@/web/services/apiClient"
import { useMutation } from "@tanstack/react-query"
import { Formik } from "formik"
import { object } from "yup"

const initialValues = {
  username: "",
  email: "",
  password: "",
}
const validationSchema = object({
  username: usernameValidator.label("Username"),
  email: emailValidator.label("E-mail"),
  password: passwordValidator.label("Password"),
})
const SignUpSuccessMessage = () => (
  <div className="flex flex-col gap-4">
    <Alert>
      We just sent you an e-mail. Please use the provided link to validate your
      account ❤️
    </Alert>
    <p>
      <Link href="/sign-in">Go to sign-in page.</Link>
    </p>
  </div>
)
const SignUpForm = ({ onSubmit }) => (
  <Formik
    validationSchema={validationSchema}
    initialValues={initialValues}
    onSubmit={onSubmit}
  >
    <Form>
      <FormField
        name="username"
        type="text"
        placeholder="Enter your username"
        label="Username"
      />
      <FormField
        name="email"
        type="email"
        placeholder="Enter your e-mail"
        label="E-mail"
      />
      <FormField
        name="password"
        type="password"
        placeholder="Enter your password"
        label="Password"
      />
      <SubmitButton>Sign Up</SubmitButton>
    </Form>
  </Formik>
)
const SignUpPage = () => {
  const { isSuccess, mutateAsync } = useMutation({
    mutationFn: (values) => apiClient.post("/users", values),
  })
  const handleSubmit = async (values) => {
    await mutateAsync(values)

    return true
  }

  return isSuccess ? (
    <SignUpSuccessMessage />
  ) : (
    <SignUpForm onSubmit={handleSubmit} />
  )
}

export default SignUpPage
