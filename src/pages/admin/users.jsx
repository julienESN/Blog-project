import React from "react"
import withAuth from "@/web/components/hoc/withAuth"
import Loader from "@/web/components/ui/Loader"
import ErrorMessage from "@/web/components/ui/ErrorMessage"
import UserEditForm from "@/web/components/UserEditForm"
import ConfirmModal from "@/web/components/ui/ConfirmModal"
import UserListItem from "@/web/components/UserListItem"
import { useUsers } from "../../hooks/useUsers"

const AdminUsersPage = () => {
  const {
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
  } = useUsers()

  if (isLoading) {
    return <Loader />
  }

  if (error) {
    return <ErrorMessage error={error} />
  }

  return (
    <div className="admin-users-container">
      <h1 className="text-3xl font-bold underline">
        User Management (Admin users are not displayed)
      </h1>
      <ul>
        {users?.map((user) => (
          <UserListItem
            key={user.id}
            user={user}
            onDelete={openConfirmModal}
            onEdit={startEditing}
          />
        ))}
      </ul>
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onConfirm={confirmDeleteUser}
        onCancel={closeConfirmModal}
        message="Are you sure you want to delete this user?"
      />
      {editingUserId !== null && (
        <UserEditForm
          user={users.find((user) => user.id === editingUserId)}
          onClose={stopEditing}
        />
      )}
    </div>
  )
}

export default withAuth(AdminUsersPage, true)
