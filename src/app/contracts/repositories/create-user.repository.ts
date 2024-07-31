import { UserEntity } from "@/domain/entities/user.entity";

export abstract class CreateUserRepository {
  abstract createUser(data: UserEntity): Promise<UserEntity>;
}
