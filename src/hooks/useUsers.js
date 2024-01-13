import { useState, useCallback } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import apiClient from "@/web/services/apiClient"

const useConfirmModal = () => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState(null)
  const openConfirmModal = useCallback((userId) => {
    setIsConfirmModalOpen(true)
    setSelectedUserId(userId)
  }, [])
  const closeConfirmModal = useCallback(() => {
    setIsConfirmModalOpen(false)
  }, [])

  return {
    isConfirmModalOpen,
    selectedUserId,
    openConfirmModal,
    closeConfirmModal,
  }
}
const useUserDeletion = (queryClient) => {
  const { mutate: deleteUser, ...deleteUserMutation } = useMutation({
    mutationFn: (userId) => apiClient.delete(`/users/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })

  return { deleteUser, ...deleteUserMutation }
}

export const useUsers = () => {
  const queryClient = useQueryClient()
  const [editingUserId, setEditingUserId] = useState(null)
  const {
    isConfirmModalOpen,
    selectedUserId,
    openConfirmModal,
    closeConfirmModal,
  } = useConfirmModal()
  const { deleteUser } = useUserDeletion(queryClient)
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await apiClient.get("/users")

      
return response.filter((user) => user.role !== "admin")
    },
  })
  const confirmDeleteUser = useCallback(() => {
    deleteUser(selectedUserId)
    closeConfirmModal()
  }, [selectedUserId, deleteUser, closeConfirmModal])
  const startEditing = useCallback((userId) => {
    setEditingUserId(userId)
  }, [])
  const stopEditing = useCallback(() => {
    setEditingUserId(null)
    queryClient.invalidateQueries(["users"])
  }, [queryClient])

  return {
    users,
    isLoading,
    error,
    editingUserId,
    isConfirmModalOpen,
    openConfirmModal,
    closeConfirmModal,
    confirmDeleteUser,
    startEditing,
    stopEditing,
  }
}
