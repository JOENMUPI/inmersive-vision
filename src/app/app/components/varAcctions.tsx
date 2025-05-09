import { Button, Group } from "@mantine/core"

export const VarActions = ({
  onClickDelete,
  onClickEdit,
  onClickSave,
  disanbledDelete,
  disanbledEdit,
  disanbledSave
}:{
  onClickSave: () => void
  onClickEdit: () => void
  onClickDelete: () => void
  disanbledSave: boolean
  disanbledEdit: boolean
  disanbledDelete: boolean
}) => {
  return (
    <Group>
      <Button 
        color="green"
        onClick={onClickSave}
        disabled={disanbledSave}
      >
        Save 
      </Button>
      <Button
          disabled={disanbledEdit}
          onClick={onClickEdit}
        >
        Edit 
      </Button>
      <Button
        color="red"
        disabled={disanbledDelete}
        onClick={onClickDelete}
      >
        Delete 
      </Button>
  </Group>
  )
}