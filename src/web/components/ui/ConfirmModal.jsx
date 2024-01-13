import Button from "@/web/components/ui/Button"
const ConfirmModal = ({ isOpen, onConfirm, onCancel, message }) => {
  if (!isOpen) {return null}

  return (
    <div className="modal">
      <p>{message}</p>
      <Button onClick={onConfirm} variant="primary" size="md">
        Yes
      </Button>
      <Button onClick={onCancel} variant="transparent" size="md">
        No
      </Button>
    </div>
  )
}

export default ConfirmModal
