'use client'

import { useEffect } from 'react'
import { useGetParams } from '@/hooks/useGetParams'
import { setRecentVist } from '@shared/libs'
import { useServiceAutomation } from '@/hooks/useServiceAutomation'
import { useTodoFilter } from '@/features/TaskFilter/useTodoFilter'
import { useUrl } from '@/hooks/useUrl'
import { useDebounce } from '@/hooks/useDebounce'

import ProjectNav from '../../[orgName]/project/[projectName]/ProjectNav'
import useGetProjectStatus from './useGetProjectStatus'
import useGetTask from './useGetTask'
import { useGetMembers } from './useGetMembers'
import useGetProjectPoint from './useGetProjectPoint'
import { useUser } from '@goalie/nextjs'
import { useGenTaskMappingObject } from '@/hooks/useGenTaskMappingObject'
import useUpdateGroupbyItem from '../TaskFilter/useUpdateGroupbyItem'
import useSetProjectViewCache from './useSetProjectViewCache'
import { useEventSyncProjectMember } from '@/events/useEventSyncProjectMember'
import { useEventSyncProjectView } from '@/events/useEventSyncProjectView'
import { useEventSyncProjectStatus } from '@/events/useEventSyncProjectStatus'
import { useGetProjectViewList } from './useGetProjectViewList'
import { useEventSyncProjectTask } from '@/events/useEventSyncProjectTask'

function SaveRecentVisitPage() {
  const { projectName, orgName } = useGetParams()
  const { user } = useUser()
  const { getSp } = useUrl()

  useDebounce(() => {
    console.log('save lastest visit url')
    if (user && user.id) {
      setRecentVist(
        user.id,
        `/${orgName}/project/${projectName}?mode=${getSp('mode')}`
      )
    }
  }, [user, projectName, orgName])

  return <></>
}

function useRegisterEvents() {
  const { projectId } = useGetParams()

  // realtime events
  useEventSyncProjectMember(projectId)
  useEventSyncProjectView(projectId)
  useEventSyncProjectStatus(projectId)
  useEventSyncProjectTask(projectId)
  
}

function useGetAutomationRulesByProject() {
  const { projectId } = useGetParams()
  const { getAutomationByProject } = useServiceAutomation()
  useEffect(() => {
    if (projectId) {
      getAutomationByProject(projectId)
    }
  }, [projectId])

}

function PrefetchData() {
  // realtime events
  useRegisterEvents()

  useSetProjectViewCache()
  useUpdateGroupbyItem()
  useTodoFilter()
  useGetProjectStatus()
  useGetTask()
  useGetMembers()
  useGetProjectPoint()
  useGetProjectViewList()
  useGetAutomationRulesByProject()

  // this hook generates objects in Map object
  // that helps to get task item as quickly as possible
  // by using task'id
  // Ex: tasks[id] or task[order]
  useGenTaskMappingObject()
  return <></>
}
export default function ProjectContainer() {

  return <>
      <PrefetchData />
      <SaveRecentVisitPage />
    <ProjectNav /></>
}
