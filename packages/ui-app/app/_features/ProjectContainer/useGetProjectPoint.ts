import { useGetParams } from "@/hooks/useGetParams"
import { projectPointGet } from "@/services/point"
import { useProjectPointStore } from "@/store/point"
import { useParams } from "next/navigation"
import { useEffect } from "react"

export default function useGetProjectPoint() {
  const { projectId } = useGetParams()
  const { addAllPoints } = useProjectPointStore()
  useEffect(() => {

    const pointController = new AbortController()
    projectId && projectPointGet(projectId, pointController.signal)
      .then(res => {
        const { data, status } = res.data
        if (status !== 200) {
          addAllPoints([])
          return
        }

        addAllPoints(data)
      })
      .catch(err => {
        console.log(err)
      })

    return () => {
      pointController.abort()
    }
  }, [projectId])
}
