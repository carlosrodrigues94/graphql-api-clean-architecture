import { HashService } from "@/app/contracts/services/hash.service";
import { createHash } from "crypto";
import { injectable } from "tsyringe";

@injectable()
export class CryptoHashService implements HashService {
  createHash(data: string): string {
    const hash = createHash("sha256");
    return hash.update(data).digest().toString("utf-8");
  }
}
