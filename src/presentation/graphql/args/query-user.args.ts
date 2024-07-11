import { Max, Min } from "class-validator";
import { ArgsType, Field, Int } from "type-graphql";

@ArgsType()
export class QueryUsersArgs {
  @Field((_type) => Int, { defaultValue: 1 })
  @Min(1)
  @Max(1000)
  limit: number;

  @Field((_type) => Int)
  @Min(0)
  offset: number;

  @Field((_type) => String, { nullable: true })
  registerStatus?: string;
}
