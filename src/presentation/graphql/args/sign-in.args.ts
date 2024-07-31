import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Max,
  Min,
} from "class-validator";
import { ArgsType, Field } from "type-graphql";

@ArgsType()
export class SignInArgs {
  @Field((_type) => String)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field((_type) => String)
  @IsString()
  @IsNotEmpty()
  @Length(8)
  password: string;
}
