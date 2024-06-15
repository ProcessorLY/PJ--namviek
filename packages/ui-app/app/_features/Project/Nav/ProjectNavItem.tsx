import { useProjectStore } from '@/store/project'
import ProjectPin from '../Pin'
import { useEffect, useState } from 'react'
import { useMenuStore } from '@/store/menu'
import Badge from '@/components/Badge'
import Tooltip from 'packages/shared-ui/src/components/Tooltip'
import { useTaskStore } from '@/store/task'
import { GoDot } from 'react-icons/go'
import { useGetParams } from '@/hooks/useGetParams'
import { useRouter } from 'next/navigation'

export default function ProjectNavItem({
  pinned = false,
  id,
  projectName,
  view,
  name,
  badge,
  icon
}: {
  pinned?: boolean
  badge?: number
  id: string
  projectName: string
  view: string
  name: string
  icon: string
}) {
  const [visible, setVisible] = useState(false)
  const { setVisible: setMenuVisible } = useMenuStore()
  const { orgName, projectId } = useGetParams()
  const { push } = useRouter()
  const active = projectId === id
  const href = `${orgName}/project/${projectName}?mode=${view}`
  const { selectProject } = useProjectStore(state => state)
  const { addAllTasks } = useTaskStore()
  const onSelectProject = (id: string) => {
    selectProject(id)
  }

  useEffect(() => {
    setTimeout(() => {
      setVisible(true)
    }, 100)
  }, [])

  const onSelectItem = (link: string) => {
    addAllTasks([])

    onSelectProject(id)
    setMenuVisible(false)
    localStorage.setItem('PROJECT_ID', id)
    localStorage.setItem('PROJECT_SLUG_NAME', projectName)
    push(link)
  }

  const showBadges = () => {
    if (!badge) return null
    return (
      <Tooltip title={`${badge} todos`} wrapDiv={true}>
        <Badge
          onClick={() => {
            onSelectItem(href + '&badgeFilter=todo')
          }}
          title={badge + ''}
        />
      </Tooltip>
    )
  }

  return (
    <div
      className={`${active ? 'active' : ''} nav-item group ${visible ? 'opacity-100' : 'opacity-0'
        } transition-all duration-300`}
      onClick={() => {
        onSelectItem(href)
      }}
      title={name}>
      <div className="left">
        <GoDot className="ml-0.5 text-gray-400 dark:text-gray-500 shrink-0" />
        <img className="w-5 h-5" src={icon || ''} />
        <span className="whitespace-nowrap truncate">{name}</span>
        {showBadges()}
      </div>
      <div className="right relative group-hover:opacity-100 opacity-0 transition-all">
        <ProjectPin projectId={id} pinned={pinned} />
      </div>
    </div>
  )
}
