import { knexConfig } from "@/infra/database/knex/knex.config";
import { KnexUserRepository } from "@/infra/database/repositories/knex-user.repository";
import { FindManyUsersUseCaseFactory } from "@/presentation/factories/find-many-users-usecase.factory";
import { TYPES } from "@/presentation/factories/types";
import { knex } from "knex";
import { container } from "tsyringe";

export const makeDependencyInjections = () => {
  container.register(TYPES.UserRepository, {
    useValue: new KnexUserRepository(knex, knexConfig),
  });

  container.register(
    TYPES.FindManyUsersUseCaseFactory,
    FindManyUsersUseCaseFactory
  );

  return { container };
};
