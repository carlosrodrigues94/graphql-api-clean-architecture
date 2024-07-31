export const TYPES = {
  UserRepository: Symbol.for("UserRepository"),
  FindManyUsersUseCaseFactory: Symbol.for("FindManyUsersUseCaseFactory"),
  SignInUseCaseFactory: Symbol.for("SignInUseCaseFactory"),
  CreateUserUseCaseFactory: Symbol.for("CreateUserUseCaseFactory"),
  FindManyUsersWithAvatarUseCaseFactory: Symbol.for(
    "FindManyUsersWithAvatarUseCaseFactory"
  ),
  CryptoHashService: Symbol.for("CryptoHashService"),
  JWTTokenService: Symbol.for("JWTTokenService"),
  UuidUniqueIdService: Symbol.for("UuidUniqueIdService"),
};
