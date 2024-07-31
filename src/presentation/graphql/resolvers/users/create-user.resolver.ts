import { Args, Mutation, Resolver } from "type-graphql";
import { UserDTO } from "@/presentation/graphql/dtos/user.dto";
import { inject, injectable } from "tsyringe";
import { TYPES } from "@/presentation/factories/types";
import { CreateUserUseCaseFactory } from "@/presentation/factories/create-user-usecase.factory";
import { CreateUserArgs } from "../../args/create-user.args";

@injectable()
@Resolver()
export class CreateUserResolver {
  constructor(
    @inject(TYPES.CreateUserUseCaseFactory)
    private readonly createUserUseCaseFactory: CreateUserUseCaseFactory
  ) {}

  @Mutation((_returns) => UserDTO)
  async createUser(@Args() data: CreateUserArgs): Promise<UserDTO> {
    const result = await this.createUserUseCaseFactory
      .build()
      .execute({ ...data });

    return Promise.resolve({
      createdAt: new Date().toUTCString(),
      updatedAt: null,
      deletedAt: null,
      userName: "John Doe",
      registerStatus: "UPDATED",
      userId: "123456",
      ...result,
    } as UserDTO);
  }
}
