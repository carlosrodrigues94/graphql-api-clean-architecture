import { UniqueIdService } from "@/app/contracts/services/unique-id.service";
import { randomUUID } from "crypto";
import { injectable } from "tsyringe";

@injectable()
export class UuidUniqueIdService implements UniqueIdService {
  generate(): string {
    return randomUUID();
  }
}
