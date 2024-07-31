import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class SignInDTO {
  @Field((_type) => String)
  token: string;

  @Field((_type) => String)
  email: string;
}
