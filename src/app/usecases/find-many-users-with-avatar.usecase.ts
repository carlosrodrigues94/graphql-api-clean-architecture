import { AvatarEntity } from "@/domain/entities/avatar.entity";
import { UserEntity } from "@/domain/entities/user.entity";
import { UseCase } from "@/app/contracts/usecase";
import { FindManyUsersWithAvatarRepository } from "@/app/contracts/repositories/find-many-users-with-avatar.repository";
import { Pagination } from "../contracts/common/pagination";

type FindManyUsersWithAvatarUseCaseParams = {
  data: Partial<UserEntity>;
  pagination: Pagination;
};

interface FindManyUsersWithAvatarUseCaseResult {
  users: Array<UserEntity & { avatar: AvatarEntity }>;
  pagination: Pagination;
}

export class FindManyUsersWithAvatarUseCase
  implements
    UseCase<
      FindManyUsersWithAvatarUseCaseParams,
      FindManyUsersWithAvatarUseCaseResult
    >
{
  constructor(
    private readonly userRepository: FindManyUsersWithAvatarRepository
  ) {}
  async execute(
    params: FindManyUsersWithAvatarUseCaseParams
  ): Promise<FindManyUsersWithAvatarUseCaseResult> {
    const { result, pagination } = await this.userRepository.findManyWithAvatar(
      {
        pagination: params.pagination,
        where: params.data,
      }
    );

    const users = result.map(({ avatar, user }) => ({ ...user, avatar }));

    return { users, pagination };
  }
}
