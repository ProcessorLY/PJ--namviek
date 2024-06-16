import { useProjectStore } from '@/store/project'
import { useRouter } from 'next/navigation'

export const useGetParams = () => {
  const { push } = useRouter()
  const { selectedProject } = useProjectStore()
  
  let orgId, orgName, projectId, projectName;
  if (typeof window !== 'undefined') {
    orgId = localStorage.getItem('ORG_ID');
    orgName = localStorage.getItem('ORG_SLUG_NAME');
    projectId = selectedProject?.id;
    projectName = selectedProject?.slug;
  }
  
  if (!orgId || !orgName) {
    push('/organization')
  }
  
  return { orgId, orgName, projectId, projectName }
}
