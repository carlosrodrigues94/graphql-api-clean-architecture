import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";
import { ArgsType, Field } from "type-graphql";

@ArgsType()
export class CreateUserArgs {
  @Field((_type) => String)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field((_type) => String)
  @IsString()
  @IsNotEmpty()
  @Length(8)
  password: string;

  @Field((_type) => String)
  @IsString()
  @IsNotEmpty()
  name: string;
}
