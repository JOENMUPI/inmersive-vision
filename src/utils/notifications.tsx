import { notifications } from "@mantine/notifications"

interface notifyBaseI {
  title: string
  id: string
  message: string
  loading?: boolean
}

export const notifyShowBase = ({
  title,
  message,
  id,
  loading = false
}: notifyBaseI) => {
  notifications.show({
    role: "alert",
    id,
    title,
    message,
    autoClose: true,
    style: { marginTop: '20%'  },
    loading,
  });
}

export const notifyUpdateBase = ({
  title,
  message,
  id,
  loading = false
}: notifyBaseI) => {
  notifications.update({
    role: "alert",
    id,
    title,
    message,
    autoClose: true,
    loading,
  });
}