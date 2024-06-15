'use client'
import { useUserRole } from '@/features/UserPermission/useUserRole'
import { useGetParams } from '@/hooks/useGetParams'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { AiOutlineAppstoreAdd, AiOutlineCloudDownload } from 'react-icons/ai'
import { HiOutlineInformationCircle, HiOutlineUserCircle } from 'react-icons/hi'
import { HiOutlineServerStack } from 'react-icons/hi2'

export default function SettingTabLayout() {
  const { orgRole } = useUserRole()
  const { orgName } = useGetParams()
  const pathname = usePathname()
  const tabs = [
    {
      title: 'About',
      name: 'about',
      href: '#',
      icon: HiOutlineInformationCircle,
      active: pathname.includes('/setting/about'),
      enable: orgRole === 'ADMIN'
    },
    {
      title: 'People',
      name: 'people',
      href: '#',
      icon: HiOutlineUserCircle,
      active: pathname.includes('/setting/people'),
      enable: true
    },
    // {
    //   title: 'Projects',
    //   name: 'projects',
    //   href: '#',
    //   icon: HiOutlineServerStack,
    //   active: false,
    //   enable: true
    // },
    // {
    //   title: 'Apps',
    //   name: 'apps',
    //   href: '#',
    //   icon: AiOutlineAppstoreAdd,
    //   active: false,
    //   enable: true
    // },
    {
      title: 'Export',
      name: 'export-import',
      href: '#',
      icon: AiOutlineCloudDownload,
      active: pathname.includes('/setting/export-import'),
      enable: true
    }
  ]

  return (
    <div className="tab pl-1">
      {tabs.map((tab, index) => {
        const Icon = tab.icon
        const isActive = tab.active ? 'active' : ''
        // const active = tab.name.toLowerCase() === mode
        if (!tab.enable) return null

        return (
          <Link
            href={`${orgName}/setting/${tab.name}`}
            className={`tab-item ${isActive}`}
            key={index}>
            <Icon />
            <span>{tab.title}</span>
          </Link>
        )
      })}
    </div>
  )
}
