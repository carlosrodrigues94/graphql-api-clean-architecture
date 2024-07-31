import { CreateUserUseCase } from "@/app/usecases/create-user.usecase";
import { inject, injectable } from "tsyringe";
import { TYPES } from "./types";
import { FindOneUserRepository } from "@/app/contracts/repositories/find-one-user.repository";
import { CreateUserRepository } from "@/app/contracts/repositories/create-user.repository";
import { HashService } from "@/app/contracts/services/hash.service";
import { UniqueIdService } from "@/app/contracts/services/unique-id.service";

@injectable()
export class CreateUserUseCaseFactory {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: FindOneUserRepository &
      CreateUserRepository,
    @inject(TYPES.CryptoHashService)
    private readonly cryptoHashService: HashService,
    @inject(TYPES.UuidUniqueIdService)
    private readonly uuidUniqueIdService: UniqueIdService
  ) {}

  build(): CreateUserUseCase {
    return new CreateUserUseCase(
      this.userRepository,
      this.uuidUniqueIdService,
      this.cryptoHashService
    );
  }
}
