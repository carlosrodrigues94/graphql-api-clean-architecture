export class AvatarEntity {
  avatarId: string;
  userUuid: string;
  url: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;

  constructor(data: AvatarEntity) {
    Object.assign(this, data);
  }
}
