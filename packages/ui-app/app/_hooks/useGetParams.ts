import { usePathname, useRouter } from 'next/navigation'

export const useGetParams = () => {
  const { push } = useRouter()
  const path = usePathname()
  let orgId, orgName, projectId, projectName;

  if (typeof window !== 'undefined') {
    orgId = localStorage.getItem('ORG_ID');
    orgName = localStorage.getItem('ORG_SLUG_NAME');
    projectId = localStorage.getItem('PROJECT_ID');
    projectName = localStorage.getItem('PROJECT_SLUG_NAME');
  }
  
  if (!orgId || !orgName) {
    push('/organization')
  }

  if (path.includes('/project') && (!projectId || !projectName)) {
    push('/organization')
  }

  return { orgId, orgName, projectId, projectName }
}
