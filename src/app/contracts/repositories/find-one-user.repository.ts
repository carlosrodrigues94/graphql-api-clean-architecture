import { UserEntity } from "@/domain/entities/user.entity";

export abstract class FindOneUserRepository {
  abstract findOne(
    where: Partial<Omit<UserEntity, "userId">>
  ): Promise<UserEntity>;
}
