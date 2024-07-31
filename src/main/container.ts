import { knex } from "knex";
import { container } from "tsyringe";
import { knexConfig } from "@/infra/database/knex/knex.config";
import { KnexUserRepository } from "@/infra/database/repositories/knex-user.repository";
import { CreateUserUseCaseFactory } from "@/presentation/factories/create-user-usecase.factory";
import { FindManyUsersUseCaseFactory } from "@/presentation/factories/find-many-users-usecase.factory";
import { FindManyUsersWithAvatarUseCaseFactory } from "@/presentation/factories/find-many-users-with-avatar-usecase.factory";
import { SignInUseCaseFactory } from "@/presentation/factories/sign-in-usecase.factory";
import { TYPES } from "@/presentation/factories/types";
import { CryptoHashService } from "@/infra/services/crypto-hash.service";
import { JWTTokenService } from "@/infra/services/jwt-token.service";
import { UuidUniqueIdService } from "@/infra/services/uuid-unique-id.service";

export const makeDependencyInjections = () => {
  container.register(TYPES.UserRepository, {
    useValue: new KnexUserRepository(knex, knexConfig),
  });

  container.register(
    TYPES.FindManyUsersUseCaseFactory,
    FindManyUsersUseCaseFactory
  );

  container.register(
    TYPES.FindManyUsersWithAvatarUseCaseFactory,
    FindManyUsersWithAvatarUseCaseFactory
  );

  container.register(TYPES.SignInUseCaseFactory, SignInUseCaseFactory);
  container.register(TYPES.CreateUserUseCaseFactory, CreateUserUseCaseFactory);
  container.register(TYPES.CryptoHashService, CryptoHashService);
  container.register(TYPES.JWTTokenService, JWTTokenService);
  container.register(TYPES.UuidUniqueIdService, UuidUniqueIdService);

  return { container };
};
