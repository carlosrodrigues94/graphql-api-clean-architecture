export class UserEntity {
  userId: string;
  userName: string;
  createdAt: string;
  registerStatus: string;
  updatedAt: string | null;
  deletedAt: string | null;

  constructor(data: UserEntity) {
    Object.assign(this, data);
  }
}
