import { UserEntity } from "@/domain/entities/user.entity";
import { ResultWithPagination, Pagination } from "../common/pagination";

export abstract class FindManyUsersRepository {
  abstract findMany(params: {
    where: Partial<UserEntity>;
    pagination: Pagination;
    include?: Array<"avatar">;
  }): Promise<ResultWithPagination<UserEntity[]>>;
}
