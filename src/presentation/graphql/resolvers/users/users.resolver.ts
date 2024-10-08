import { inject, injectable } from "tsyringe";
import { Args, Authorized, Query, Resolver } from "type-graphql";
import { FindManyUsersUseCaseFactory } from "@/presentation/factories/find-many-users-usecase.factory";
import { TYPES } from "@/presentation/factories/types";
import {
  PaginatedUsersDTO,
  UserDTO,
} from "@/presentation/graphql/dtos/user.dto";
import { QueryUsersArgs } from "@/presentation/graphql/args/query-user.args";

@injectable()
@Resolver((_of) => UserDTO)
export class UsersResolver {
  constructor(
    @inject(TYPES.FindManyUsersUseCaseFactory)
    private readonly findManyUsersUseCaseFactory: FindManyUsersUseCaseFactory
  ) {}

  @Authorized(["USER"])
  @Query((_returns) => PaginatedUsersDTO)
  async users(@Args() { registerStatus, ...rest }: QueryUsersArgs) {
    const usecase = this.findManyUsersUseCaseFactory.build();

    const { users, pagination } = await usecase.execute({
      data: registerStatus ? { registerStatus } : {},
      pagination: rest,
    });

    return { result: users, pagination };
  }
}
