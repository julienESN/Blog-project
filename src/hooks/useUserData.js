import { useState, useCallback, useEffect } from "react"
import { useMutation } from "@tanstack/react-query"
import apiClient from "@/web/services/apiClient"

const useUserData = (session) => {
  const [userData, setUserData] = useState({ username: "", email: "" })
  const fetchUserData = useCallback(async () => {
    if (session?.id) {
      try {
        const response = await apiClient.get(`/users/${session.id}`)
        setUserData({
          username: response.username,
          email: response.email,
        })
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error)
      }
    }
  }, [session?.id])

  useEffect(() => {
    fetchUserData()
  }, [fetchUserData])

  return userData
}
const useUpdateUser = (session, setAlert) => {
  const updateUserMutation = useMutation({
    mutationFn: (updatedUser) =>
      apiClient.patch(`/users/${session?.id}`, updatedUser),
  })
  const handleSubmit = async (values, actions, saveSessionToken) => {
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

  return handleSubmit
}

export { useUserData, useUpdateUser }
