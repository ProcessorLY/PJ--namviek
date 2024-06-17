import { FileStorage } from '@prisma/client'
import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from '@prisma/client/runtime/library';

export type PinnedProjectSetting = {
  id: string
  createdAt: Date
}

export interface UserSetting {
  pinnedProjects?: PinnedProjectSetting[]
}

interface ActivityData {
  content?: string
}

interface Interaction {
  emoji: string
  updatedBy: string
}

export interface ActivityCommentData extends ActivityData {
  edited?: boolean
  interactions?: Interaction[]
}

export interface ActivityAttachData extends ActivityData {
  attachedFile?: FileStorage // others can reply comment's link
}

interface ActivityChangeData extends ActivityData {
  changeFrom: string
  changeTo: string
}

export type ActivityLogData = ActivityChangeData

export type TxTransaction = Omit<
  PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    DefaultArgs
  >,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

