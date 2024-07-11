import { inject, injectable } from "tsyringe";
import { Args, Mutation, Query, Resolver } from "type-graphql";
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
  @Query((_returns) => PaginatedUsersDTO)
  async users(@Args() { registerStatus, ...rest }: QueryUsersArgs) {
    const usecase = this.findManyUsersUseCaseFactory.build();
    const { users, pagination } = await usecase.execute({
      data: registerStatus ? { registerStatus } : {},
      pagination: rest,
    });

    return { result: users, pagination };
  }

  @Mutation((returns) => UserDTO)
  //  @Authorized()
  addRecipe(): //  @Arg("newRecipeData") newRecipeData: NewRecipeInput,
  //  @Ctx("user") user: User
  Promise<UserDTO> {
    return Promise.resolve({
      createdAt: new Date().toUTCString(),
      updatedAt: null,
      deletedAt: null,
      userName: "John Doe",
      registerStatus: "UPDATED",
      userId: "123456",
    } as UserDTO);
  }
}
