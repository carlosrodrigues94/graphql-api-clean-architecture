import { inject, injectable } from "tsyringe";
import { Args, Mutation, Resolver } from "type-graphql";
import { SignInDTO } from "@/presentation/graphql/dtos/sign-in.dto";
import { TYPES } from "@/presentation/factories/types";
import { SignInUseCaseFactory } from "@/presentation/factories/sign-in-usecase.factory";
import { SignInArgs } from "@/presentation/graphql/args/sign-in.args";

@injectable()
@Resolver()
export class SignInResolver {
  constructor(
    @inject(TYPES.SignInUseCaseFactory)
    private readonly signInUseCaseFactory: SignInUseCaseFactory
  ) {}

  @Mutation((_returns) => SignInDTO)
  async signIn(@Args() { email, password }: SignInArgs): Promise<SignInDTO> {
    return this.signInUseCaseFactory.build().execute({
      email,
      password,
    });
  }
}
