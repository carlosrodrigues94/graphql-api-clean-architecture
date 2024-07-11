import { FindManyUsersUseCase } from "@/app/usecases/find-many-users.usecase";
import { UserRepository } from "@/infra/database/repositories/knex-user.repository";
import { TYPES } from "@/presentation/factories/types";
import { inject, injectable } from "tsyringe";

@injectable()
export class FindManyUsersUseCaseFactory {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: UserRepository
  ) {}
  build(): FindManyUsersUseCase {
    return new FindManyUsersUseCase(this.userRepository);
  }
}
