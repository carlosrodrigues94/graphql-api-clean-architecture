import { FindOneUserRepository } from "@/app/contracts/repositories/find-one-user.repository";
import { HashService } from "@/app/contracts/services/hash.service";
import { TokenService } from "@/app/contracts/services/token.service";
import { UseCase } from "@/app/contracts/usecase";

export type SignInUseCaseParams = {
  email: string;
  password: string;
};
export type SignInUseCaseResult = undefined | { token: string; email: string };
export class SignInUseCase
  implements UseCase<SignInUseCaseParams, SignInUseCaseResult>
{
  constructor(
    private readonly userRepository: FindOneUserRepository,
    private readonly hashService: HashService,
    private readonly tokenService: TokenService
  ) {}
  async execute(params: SignInUseCaseParams): Promise<SignInUseCaseResult> {
    const { email, password } = params;
    const user = await this.userRepository.findOne({
      email,
      password: this.hashService.createHash(password),
    });

    if (!user) {
      throw new Error(
        "Invalid login data, confirm if email and password is correct"
      );
    }

    const token = this.tokenService.generateToken({
      roles: ["USER"],
      userId: user.userId,
    });

    return {
      email: user.email,
      token,
    };
  }
}
