import { UserEntity } from "@/domain/entities/user.entity";
import {
  Pagination,
  UserRepository,
} from "@/infra/database/repositories/knex-user.repository";

export abstract class UseCase<P, R> {
  abstract execute(data: P): Promise<R>;
}

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
  constructor(private readonly userRepository: UserRepository) {}
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
