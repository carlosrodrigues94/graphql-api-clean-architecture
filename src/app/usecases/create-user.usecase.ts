import { UserEntity } from "@/domain/entities/user.entity";
import { CreateUserRepository } from "@/app/contracts/repositories/create-user.repository";
import { UniqueIdService } from "@/app/contracts/services/unique-id.service";
import { HashService } from "@/app/contracts/services/hash.service";
import { FindOneUserRepository } from "@/app/contracts/repositories/find-one-user.repository";
import { UseCase } from "@/app/contracts/usecase";
import { ApplicationException } from "../errors/application-error";

export type CreateUserUseCaseParams = {
  name: string;
  email: string;
  password: string;
};

export type CreateUserUseCaseResult = Omit<UserEntity, "password" | "id">;

export class CreateUserUseCase
  implements UseCase<CreateUserUseCaseParams, CreateUserUseCaseResult>
{
  constructor(
    private readonly userRepository: CreateUserRepository &
      FindOneUserRepository,
    private readonly uniqueIdService: UniqueIdService,
    private readonly hashService: HashService
  ) {}

  async execute({ email, name, password }: CreateUserUseCaseParams) {
    const userAlreadyExists = await this.userRepository.findOne({ email });

    if (userAlreadyExists) {
      throw new ApplicationException("User already exists", 400);
    }
    const user = await this.userRepository.createUser({
      createdAt: new Date().toUTCString(),
      deletedAt: null,
      registerStatus: "REGISTERED",
      updatedAt: null,
      userId: this.uniqueIdService.generate(),
      userName: name,
      password: this.hashService.createHash(password),
      email,
    });

    return user;
  }
}
