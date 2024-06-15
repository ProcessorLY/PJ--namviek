import { useProjectViewStore } from "@/store/projectView";
import { ProjectView } from "@prisma/client";
import localforage from "localforage";
import { useEffect } from "react";
import { projectViewMap } from "../ProjectView/useProjectViewList";
import { useReRenderView } from "../ProjectView/useReRenderView";
import { useGetParams } from "@/hooks/useGetParams";

export default function useSetProjectViewCache() {
  const { addAllView } = useProjectViewStore()
  const { projectId } = useGetParams()
  const { doReRender } = useReRenderView()
  const key = `PROJECT_VIEW_${projectId}`

  // set all view to caches
  useEffect(() => {
    localforage.getItem(key).then(val => {
      if (val) {
        const views = val as ProjectView[]

        views.forEach(v => projectViewMap.set(v.id, v.type))
        console.log("set project's view cache")
        addAllView(views)
        doReRender()
      }
    })
  }, [])
}
