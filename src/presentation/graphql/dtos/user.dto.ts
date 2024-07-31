import "reflect-metadata";
import { UserEntity } from "@/domain/entities/user.entity";
import { Field, ID, ObjectType } from "type-graphql";
import { PaginationDTO } from "@/presentation/graphql/dtos/pagination.dto";

@ObjectType()
export class UserDTO implements UserEntity {
  @Field((_type) => String)
  password: string;

  @Field((_type) => ID)
  userId: string;

  @Field((_type) => String)
  userName: string;

  @Field((_type) => String)
  email: string;

  @Field((_type) => String)
  createdAt: string;

  @Field((_type) => String)
  registerStatus: string;

  @Field((_type) => String, { nullable: true })
  updatedAt: string;

  @Field((_type) => String, { nullable: true })
  deletedAt: string;
}

@ObjectType()
export class PaginatedUsersDTO {
  @Field((_type) => [UserDTO])
  result: UserDTO[];

  @Field((_type) => PaginationDTO)
  pagination: PaginationDTO;
}
