import { UserEntity } from "@/domain/entities/user.entity";
import { Knex } from "knex";
import { injectable } from "tsyringe";

interface ResultWithPagination<R> {
  result: R;
  pagination: Pagination & { total: number };
}

export abstract class UserRepository {
  abstract findMany(params: {
    where: Partial<UserEntity>;
    pagination: Pagination;
  }): Promise<ResultWithPagination<UserEntity[]>>;

  abstract toCamelCase(data: Record<string, any>): UserEntity;
  abstract toSnakeCase(data: Record<string, any>): Record<string, any>;
}

export interface Pagination {
  limit: number;
  offset: number;
}

@injectable()
export class KnexUserRepository implements UserRepository {
  private client: Knex<any, any>;

  constructor(
    private readonly knexFunction: Function,
    private readonly knexConfig: Knex.Config
  ) {
    if (!this.client) {
      this.client = this.knexFunction(this.knexConfig);
    }
  }
  async findMany(params: {
    where: Partial<UserEntity>;
    pagination: Pagination;
  }): Promise<ResultWithPagination<UserEntity[]>> {
    const { where, pagination } = params;
    const { limit, offset } = this.validatePagination(pagination);

    const [{ count }] = await this.client.table("users").count("*");
    const total = Number(count);

    const records = await this.client
      .table("users")
      .select("*")
      .where({ ...this.toSnakeCase(where) })
      .limit(limit)
      .offset(offset)
      .returning("*");

    return {
      result: records.map(this.toCamelCase),
      pagination: { total, limit, offset },
    };
  }

  toSnakeCase(data: Record<string, any>) {
    const result = { register_status: data.registerStatus };

    const sanitized = Object.entries(result)
      .map(([key, value]) => {
        if (!value) return null;
        return { [key]: value };
      })
      .filter(Boolean)
      .reduce((prev, acc) => {
        return { ...prev, ...acc };
      }, {});

    return sanitized;
  }

  toCamelCase(data: Record<string, any>): UserEntity {
    return new UserEntity({
      createdAt: data.created_at,
      deletedAt: data.deleted_at,
      registerStatus: data.register_status,
      updatedAt: data.updated_at,
      userId: data.user_id,
      userName: data.user_name,
    });
  }

  private validatePagination(pagination: Pagination): Pagination {
    let { limit = 100, offset = 0 } = pagination;

    if (limit > 1000) {
      limit = 1000;
    }

    if (offset < 0) {
      offset = 0;
    }

    return { limit, offset };
  }
}
