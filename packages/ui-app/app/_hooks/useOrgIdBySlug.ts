import { orgGetBySlug } from '@/services/organization'
import { getLocalCache, setLocalCache } from '@shared/libs'
import { useGetParams } from '@/hooks/useGetParams'
import { useEffect, useState } from 'react'

export const useOrgIdBySlug = () => {
  const [orgId, setOrgId] = useState<string>()
  const { orgName } = useGetParams()

  useEffect(() => {
    const orgId = getLocalCache('ORG_ID')
    if (orgId) {
      setOrgId(orgId)
      return
    }
    
    orgName && orgGetBySlug(orgName).then(res => {
      const { data } = res.data
      
      setLocalCache('ORG_ID', data.id)
      setOrgId(data.id)
    }).catch(e => {
      console.log(e)
    })
  }, [orgName])

  return { orgId }
}
