import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
export class PaginationDTO {
  @Field((type) => Int)
  limit: number;

  @Field((type) => Int)
  offset: number;

  @Field((_type) => Int)
  total: number;
}
