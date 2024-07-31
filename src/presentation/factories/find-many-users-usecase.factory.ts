import { FindManyUsersRepository } from "@/app/contracts/repositories/find-many-users.repository";
import { FindManyUsersUseCase } from "@/app/usecases/find-many-users.usecase";
import { TYPES } from "@/presentation/factories/types";
import { inject, injectable } from "tsyringe";

@injectable()
export class FindManyUsersUseCaseFactory {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: FindManyUsersRepository
  ) {}
  build(): FindManyUsersUseCase {
    return new FindManyUsersUseCase(this.userRepository);
  }
}
