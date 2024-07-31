import "reflect-metadata";
import { Field, ID, ObjectType } from "type-graphql";
import { AvatarEntity } from "@/domain/entities/avatar.entity";

@ObjectType()
export class AvatarDTO implements AvatarEntity {
  @Field((_type) => ID)
  avatarId: string;

  @Field((_type) => String)
  url: string;

  @Field((_type) => String)
  userUuid: string;

  @Field((_type) => String)
  createdAt: string;

  @Field((_type) => String, { nullable: true })
  updatedAt: string;

  @Field((_type) => String, { nullable: true })
  deletedAt: string;
}
