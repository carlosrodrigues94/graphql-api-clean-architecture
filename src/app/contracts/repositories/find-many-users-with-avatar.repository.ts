import { UserEntity } from "@/domain/entities/user.entity";
import { AvatarEntity } from "@/domain/entities/avatar.entity";
import { Pagination, ResultWithPagination } from "../common/pagination";

export abstract class FindManyUsersWithAvatarRepository {
  abstract findManyWithAvatar(params: {
    where: Partial<UserEntity>;
    pagination: Pagination;
  }): Promise<
    ResultWithPagination<Array<{ user: UserEntity; avatar: AvatarEntity }>>
  >;
}
