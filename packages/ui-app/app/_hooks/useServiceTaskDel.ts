import { taskDelete } from '@/services/task'
import { useTaskStore } from '@/store/task'
import { useGetParams } from '@/hooks/useGetParams'

export const useServiceTaskDel = () => {
  const { projectId } = useGetParams()
  const { delTask } = useTaskStore()

  const deleteTask = (id: string) => {
    console.log('delete task called', id)
    delTask(id)

    projectId && taskDelete({
      projectId,
      id
    })
  }

  const deleteLocalTask = (id: string) => {
    delTask(id)
  }

  return {
    deleteLocalTask,
    deleteTask
  }
}
