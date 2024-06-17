import { TxTransaction, checkProjectExists } from "@shared/models"
import InternalServerException from "../../exceptions/InternalServerException"
import { pmClient } from "packages/shared-models/src/lib/_prisma"
import { generateSlug } from "@shared/libs"
import { MemberRole, Project, ProjectViewType, StatusType } from "@prisma/client"
import { CKEY, delCache } from "../../lib/redis"

type TProjectCreateContructorParams = {
  userId: string,
  body: {
    icon: string
    name: string
    desc: string
    views: string[]
    members: string[]
    organizationId: string
  }
}

export default class ProjectCreateService {
  tx: TxTransaction
  userId: string
  projectId: string
  body: {
    icon: string
    name: string
    desc: string
    views: string[]
    members: string[]
    organizationId: string
  }

  constructor({ userId, body }: TProjectCreateContructorParams) {
    this.body = body
    this.userId = userId
  }

  async implement() {
    this.preventDuplicateProjectName()
    this.startCreatingProject()
  }

  async startCreatingProject() {
    const userId = this.userId

    pmClient.$transaction(async tx => {
      this.tx = tx

      const result = await this._createProject()
      const { firstProjectView } = await this._createProjectView()

      const promises = await Promise.all([
        this._createPointPromise(),
        this._addMemberPromise(),
        this._createDefaultStatusPromise(),
      ])
      await Promise.all(promises)

      delCache([CKEY.USER_PROJECT, userId])

      const retData: Project = {
        ...result,
        projectViewId: firstProjectView.id
      }
      console.log('delete cache done', retData)

      return retData
    })
  }

  private async preventDuplicateProjectName() {
    const body = this.body
    const existingProject = await checkProjectExists(body.name, body.organizationId);

    if (existingProject) {
      throw new InternalServerException("DUPLICATE_PROJECT")
    }
  }

  private async _createProjectView() {
    const views = this.body.views
    const projectId = this.projectId
    const userId = this.userId
    const tx = this.tx
    const [theFirstView, ...restView] = views

    let viewOrder = 1
    const defaultView = {
      icon: null,
      name: theFirstView.slice(0, 1).toUpperCase() + theFirstView.slice(1).toLowerCase(),
      projectId,
      type: theFirstView as ProjectViewType,
      data: {},
      order: viewOrder,
      createdAt: new Date(),
      createdBy: userId,
      updatedBy: null,
      updatedAt: null
    }

    const restViewDatas = restView.map(v => ({
      icon: null,
      name: v.slice(0, 1).toUpperCase() + v.slice(1).toLowerCase(),
      projectId,
      type: v as ProjectViewType,
      data: {},
      order: ++viewOrder,
      createdAt: new Date(),
      createdBy: userId,
      updatedBy: null,
      updatedAt: null
    }))


    console.log('create rest views but the first one', restViewDatas.length)

    restViewDatas.length && await tx.projectView.createMany({
      data: restViewDatas
    })

    console.log('create first view')
    const firstProjectView = await tx.projectView.create({
      data: defaultView
    })

    console.log('updating first view to project', firstProjectView.id)
    await tx.project.update({
      where: {
        id: projectId
      },
      data: {
        projectViewId: firstProjectView.id
      }
    })

    return {
      firstProjectView
    }
  }

  private async _createProject() {
    const body = this.body
    const tx = this.tx
    const userId = this.userId

    const result = await tx.project.create({
      data: {
        cover: null,
        icon: body.icon || '',
        slug: generateSlug(body.name),
        projectViewId: null,
        name: body.name,
        desc: body.desc,
        createdBy: userId,
        isArchived: false,
        createdAt: new Date(),
        organizationId: body.organizationId,
        updatedAt: null,
        updatedBy: null
      }
    })

    this.projectId = result.id
    return result
  }

  private async _createPointPromise() {
    const projectId = this.projectId
    const tx = this.tx

    // Prepare default data - START

    const initialPointData = [
      { point: 1, projectId, icon: null },
      { point: 2, projectId, icon: null },
      { point: 3, projectId, icon: null },
      { point: 5, projectId, icon: null },
      { point: 8, projectId, icon: null }
    ]

    // Prepare default data - END
    const taskPointPromise = tx.taskPoint.createMany({
      data: initialPointData
    })

    return taskPointPromise
  }

  private async _createDefaultStatusPromise() {
    const projectId = this.projectId

    const initialStatusData = [
      {
        color: '#d9d9d9',
        name: 'TODO',
        order: 0,
        projectId,
        type: StatusType.TODO
      },
      {
        color: '#4286f4',
        name: 'INPROGRESS',
        order: 1,
        projectId,
        type: StatusType.INPROCESS
      },
      {
        color: '#4caf50',
        name: 'CLOSED',
        order: 2,
        projectId,
        type: StatusType.DONE
      }
    ]

    // Add default project status - START
    const projectStatusPromise = this.tx.taskStatus.createMany({
      data: initialStatusData
    })

    return projectStatusPromise
    // Add default project status - END
  }
  private async _addMemberPromise() {

    const members = this.body.members
    const projectId = this.projectId
    const userId = this.userId
    const tx = this.tx
    // Add project members - START
    const memberDatas = members.map(m => ({
      uid: m,
      projectId,
      role: m === userId ? MemberRole.MANAGER : MemberRole.MEMBER,
      createdAt: new Date(),
      createdBy: userId,
      updatedBy: null,
      updatedAt: null
    }))

    const memberPromise = tx.members.createMany({
      data: memberDatas
    })

    return memberPromise

    // Add project members - END
  }
}

