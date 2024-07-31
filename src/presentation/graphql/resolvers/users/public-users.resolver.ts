import { inject, injectable } from "tsyringe";
import { Query, Resolver } from "type-graphql";
import { PublicUsersDTO } from "../../dtos/public-users.dto";
import { TYPES } from "@/presentation/factories/types";
import { FindManyUsersUseCaseFactory } from "@/presentation/factories/find-many-users-usecase.factory";

@injectable()
@Resolver()
export class PublicUsersResolver {
  constructor(
    @inject(TYPES.FindManyUsersWithAvatarUseCaseFactory)
    private readonly findManyUsersWithAvatarUseCaseFactory: FindManyUsersUseCaseFactory
  ) {}

  @Query((_returns) => PublicUsersDTO)
  async publicUsers(): Promise<PublicUsersDTO> {
    const usecase = this.findManyUsersWithAvatarUseCaseFactory.build();
    const { users } = await usecase.execute({
      data: { registerStatus: "REGISTERED" },
      pagination: {
        limit: 50,
        offset: 0,
      },
    });
    return { result: users } as any;
  }
}
