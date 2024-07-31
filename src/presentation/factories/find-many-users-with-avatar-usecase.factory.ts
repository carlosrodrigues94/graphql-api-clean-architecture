import { FindManyUsersWithAvatarRepository } from "@/app/contracts/repositories/find-many-users-with-avatar.repository";
import { FindManyUsersWithAvatarUseCase } from "@/app/usecases/find-many-users-with-avatar.usecase";
import { TYPES } from "@/presentation/factories/types";
import { inject, injectable } from "tsyringe";

@injectable()
export class FindManyUsersWithAvatarUseCaseFactory {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: FindManyUsersWithAvatarRepository
  ) {}
  build(): FindManyUsersWithAvatarUseCase {
    return new FindManyUsersWithAvatarUseCase(this.userRepository);
  }
}
