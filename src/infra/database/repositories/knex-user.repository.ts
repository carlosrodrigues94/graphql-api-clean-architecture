import {
  Pagination,
  ResultWithPagination,
} from "@/app/contracts/common/pagination";
import { CreateUserRepository } from "@/app/contracts/repositories/create-user.repository";
import { FindManyUsersWithAvatarRepository } from "@/app/contracts/repositories/find-many-users-with-avatar.repository";
import { FindManyUsersRepository } from "@/app/contracts/repositories/find-many-users.repository";
import { FindOneUserRepository } from "@/app/contracts/repositories/find-one-user.repository";
import { AvatarEntity } from "@/domain/entities/avatar.entity";
import { UserEntity } from "@/domain/entities/user.entity";
import { Knex } from "knex";
import { injectable } from "tsyringe";

@injectable()
export class KnexUserRepository
  implements
    FindManyUsersRepository,
    FindManyUsersWithAvatarRepository,
    CreateUserRepository,
    FindOneUserRepository
{
  private client: Knex<any, any>;

  constructor(
    private readonly knexFunction: Function,
    private readonly knexConfig: Knex.Config
  ) {
    if (!this.client) {
      this.client = this.knexFunction(this.knexConfig);
    }
  }
  async createUser(data: UserEntity): Promise<UserEntity> {
    const params = this.sanitizeObject(this.toSnakeCase(data));
    const [record] = await this.client
      .table("users")
      .insert(params)
      .returning("*");

    return this.removeObjectKeys(record, ["password"]) as UserEntity;
  }
  async findOne(
    where: Partial<Omit<UserEntity, "userId">>,
    include: Array<"avatar"> = []
  ): Promise<UserEntity | null> {
    const data = this.sanitizeObject(this.toSnakeCase(where));

    let columns = ["*"];
    if (include.length) {
      columns = [
        "users.*",
        "users_avatars.url",
        "users_avatars.avatar_id",
        "users_avatars.created_at as avatar_created_at",
        "users_avatars.updated_at as avatar_updated_at",
        "users_avatars.deleted_at as avatar_deleted_at",
      ];
    }

    const query = this.client.select(columns).from("users").where(data);

    if (include.length) {
      query.join("users_avatars", "users.user_id", "users_avatars.user_uuid");
    }

    const record = await query.first();

    if (record) {
      return this.toCamelCase(record);
    }
    return null;
  }

  async findMany(params: {
    where: Partial<UserEntity>;
    pagination: Pagination;
    include?: Array<"avatar">;
  }): Promise<ResultWithPagination<UserEntity[]>> {
    const { where, pagination } = params;
    const { limit, offset } = this.validatePagination(pagination);

    const [{ count }] = await this.client.table("users").count("*");
    const total = Number(count);

    let columns = ["*"];
    if (params.include?.length) {
      columns = [
        "users.*",
        "users_avatars.url as avatar_url",
        "users_avatars.avatar_id",
        "users_avatars.created_at as avatar_created_at",
        "users_avatars.updated_at as avatar_updated_at",
        "users_avatars.deleted_at as avatar_deleted_at",
      ];
    }

    const query = this.client
      .select(columns)
      .from("users")
      .where(this.sanitizeObject(this.toSnakeCase(where)));

    if (params.include?.length) {
      query.join("users_avatars", "users.user_id", "users_avatars.user_uuid");
    }

    const records = await query.limit(limit).offset(offset).returning("*");

    return {
      result: records.map(this.toCamelCase),
      pagination: { total, limit, offset },
    };
  }

  async findManyWithAvatar(params: { pagination: Pagination }) {
    const { pagination } = params;
    const columns = [
      "users.*",
      "users_avatars.url",
      "users_avatars.avatar_id",
      "users_avatars.created_at as avatar_created_at",
      "users_avatars.updated_at as avatar_updated_at",
      "users_avatars.deleted_at as avatar_deleted_at",
    ];

    const [{ count }] = await this.client.count("*").from("users");

    const total = Number(count);
    const records = await this.client
      .select(columns)
      .from("users")
      .join("users_avatars", "users.user_id", "users_avatars.user_uuid")
      .offset(pagination.offset)
      .limit(pagination.limit)
      .catch((err) => {
        console.log(err);
        return [];
      });

    const result = records.map((record) => {
      return {
        user: new UserEntity(this.toCamelCase(record)),
        avatar: new AvatarEntity({
          avatarId: record.avatar_id,
          userUuid: record.user_uuid,
          createdAt: record.avatar_created_at,
          updatedAt: record.avatar_updated_at,
          deletedAt: record.avatar_deleted_at,
          url: record.url,
        }),
      };
    });

    return {
      result,
      pagination: {
        ...pagination,
        total,
      },
    };
  }

  toSnakeCase(data: Partial<UserEntity>) {
    const result = {
      register_status: data.registerStatus,
      email: data.email,
      created_at: data.createdAt,
      updated_at: data.updatedAt,
      deleted_at: data.deletedAt,
      user_name: data.userName,
      user_id: data.userId,
      password: data.password,
    };

    return result;
  }

  toCamelCase(
    data: Record<string, any>
  ): UserEntity & { avatar?: AvatarEntity } {
    const user = new UserEntity({
      createdAt: data.created_at,
      deletedAt: data.deleted_at,
      registerStatus: data.register_status,
      updatedAt: data.updated_at,
      userId: data.user_id,
      userName: data.user_name,
      email: data.email,
      password: data.password,
    });

    let avatar: AvatarEntity;

    if (data.avatar_id) {
      avatar = new AvatarEntity({
        avatarId: data.avatar_id,
        createdAt: data.avatar_created_at,
        deletedAt: data.avatar_deleted_at,
        updatedAt: data.avatar_updated_at,
        url: data.avatar_url,
        userUuid: data.user_id,
      });
    }

    return { ...user, avatar };
  }

  private removeObjectKeys(data: Record<string, any>, keys: string[]) {
    const sanitized = Object.entries(data)
      .map(([key, value]) => {
        if (keys.includes(key)) return null;
        return { [key]: value };
      })
      .filter(Boolean)
      .reduce((prev, acc) => {
        return { ...prev, ...acc };
      }, {});

    return sanitized;
  }

  private sanitizeObject(data: Record<string, any>) {
    const sanitized = Object.entries(data)
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
