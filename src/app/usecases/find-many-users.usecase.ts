import { UserEntity } from "@/domain/entities/user.entity";
import { UseCase } from "@/app/contracts/usecase";
import { FindManyUsersRepository } from "@/app/contracts/repositories/find-many-users.repository";
import { Pagination } from "../contracts/common/pagination";

type FindManyUsersUseCaseParams = {
  data: Partial<UserEntity>;
  pagination: Pagination;
};

interface FindManyUsersUseCaseResult {
  users: UserEntity[];
  pagination: Pagination;
}

export class FindManyUsersUseCase
  implements UseCase<FindManyUsersUseCaseParams, FindManyUsersUseCaseResult>
{
  constructor(private readonly userRepository: FindManyUsersRepository) {}
  async execute(
    params: FindManyUsersUseCaseParams
  ): Promise<FindManyUsersUseCaseResult> {
    const { result, pagination } = await this.userRepository.findMany({
      pagination: params.pagination,
      where: params.data,
    });

    return { users: result, pagination };
  }
}
