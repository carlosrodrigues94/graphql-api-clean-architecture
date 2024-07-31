import { FindOneUserRepository } from "@/app/contracts/repositories/find-one-user.repository";
import { HashService } from "@/app/contracts/services/hash.service";
import { TokenService } from "@/app/contracts/services/token.service";
import { inject, injectable } from "tsyringe";
import { TYPES } from "./types";
import { SignInUseCase } from "@/app/usecases/sign-in.usecase";

@injectable()
export class SignInUseCaseFactory {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: FindOneUserRepository,
    @inject(TYPES.CryptoHashService)
    private readonly cryptoHashService: HashService,
    @inject(TYPES.JWTTokenService)
    private readonly jwtTokenService: TokenService
  ) {}
  build() {
    return new SignInUseCase(
      this.userRepository,
      this.cryptoHashService,
      this.jwtTokenService
    );
  }
}
