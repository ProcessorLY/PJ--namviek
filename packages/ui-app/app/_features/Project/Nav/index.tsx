'use client'

import { PinnedProjectSetting, useProjectStore } from '@/store/project'
import { useEffect } from 'react'
import { projectGet, projectPinGetList } from '@/services/project'
import { useGetParams } from '@/hooks/useGetParams'
import { Project } from '@prisma/client'
import ProjectNavItem from './ProjectNavItem'
import { useProjectPinUnpin } from '@/hooks/useProjectPinUnPin'
import { useTodoCounter } from '@/hooks/useTodoCounter'
import { Loading } from '@shared/ui'
import { useServiceProject } from '@/services/hooks/useServiceProject'

export default function ProjectList() {
  const { todoCounter } = useTodoCounter()
  const { extractPinNUnpinProjects } = useProjectPinUnpin()
  const { loading, projects, selectProject, pinnedProjects } = useProjectStore(
    state => state
  )
  const { projectId } = useGetParams()

  useServiceProject()

  const onSelectProject = (id: string) => {
    selectProject(id)
  }

  useEffect(() => {
    // active project item on sidebar
    // as the url contains projectID
    projects &&
      projects.some(p => {
        if (p.id === projectId) {
          onSelectProject(p.id)
          return true
        }
      })
  }, [projects])

  const { pin, unpin } = extractPinNUnpinProjects(projects, pinnedProjects)

  return (
    <nav className="nav">
      <Loading enabled={loading} className="px-5" title="Loading ..." />
      {pin.length ? <h2 className="section">Pinned</h2> : null}
      {!loading &&
        pin.map(project => {
          const { id, name, icon, projectViewId, slug } = project
          const counter = todoCounter[id]

          return (
            <ProjectNavItem
              pinned={true}
              badge={counter}
              view={projectViewId || ''}
              key={id}
              id={id}
              projectName={slug}
              name={name || ''}
              icon={icon || ''}
            />
          )
        })}
      {pin.length ? <h2 className="section">All project</h2> : null}
      {!loading &&
        unpin.map(project => {
          const { id, name, icon, projectViewId, slug } = project
          const counter = todoCounter[id]

          return (
            <ProjectNavItem
              badge={counter}
              key={id}
              view={projectViewId || ''}
              id={id}
              projectName={slug}
              name={name || ''}
              icon={icon || ''}
            />
          )
        })}
    </nav>
  )
}
