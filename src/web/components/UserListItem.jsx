import React from "react"
import Button from "@/web/components/ui/Button"

const UserListItem = React.memo(({ user, onEdit, onDelete }) => (
  <li>
    <span>
      {user.username} - {user.email}
    </span>
    <Button onClick={() => onDelete(user.id)}>Delete</Button>
    <Button onClick={() => onEdit(user.id)}>Edit</Button>
  </li>
))

UserListItem.displayName = "UserListItem"

export default UserListItem
