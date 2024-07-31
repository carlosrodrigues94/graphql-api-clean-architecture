import { Field, ObjectType } from "type-graphql";
import { PaginationDTO } from "./pagination.dto";
import { UserDTO } from "./user.dto";
import { AvatarDTO } from "./avatar.dto";

@ObjectType()
class UserWithAvatarDTO extends UserDTO {
  @Field((_type) => AvatarDTO)
  avatar: AvatarDTO;
}

@ObjectType()
export class PublicUsersDTO {
  @Field((_type) => [UserWithAvatarDTO])
  result: UserWithAvatarDTO[];

  @Field((_type) => PaginationDTO)
  pagination?: PaginationDTO;
}
