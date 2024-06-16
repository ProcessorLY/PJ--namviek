import { Favorites } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { HiChevronRight } from 'react-icons/hi2'
import FavoriteRemove from './FavoriteRemove'
import { useUrl } from '@/hooks/useUrl'
import { useProjectStore } from '@/store/project'
import { useEffect } from 'react'
import { useMenuStore } from '@/store/menu'
import { useGetParams } from '@/hooks/useGetParams'

export default function FavoriteProjectItem({
  data,
  active
}: {
  data: Favorites
  active: boolean
}) {
  const { setVisible: setMenuVisible } = useMenuStore()
  const { push } = useRouter()
  const { projectId } = useGetParams()
  const { selectProject } = useProjectStore()
  const { link, id, icon, name } = data
  // const activeClass = url.includes(link) ? 'active' : ''
  const activeClass = active ? 'active' : ''

  useEffect(() => {
    projectId && selectProject(projectId)
  }, [projectId])

  return (
    <div
      onClick={() => {
        if (link) {
          setMenuVisible(false)
          push(link)
        }
      }}
      className={`nav-item group ${activeClass}`}>
      <div className="left">
        <HiChevronRight className="text-gray-400" />
        <img src={icon} className="w-5 h-5" />
        <span className="whitespace-nowrap">{name}</span>
      </div>
      <FavoriteRemove className="opacity-0 group-hover:opacity-100" id={id} />
    </div>
  )
}
