import { randomUUID } from "crypto";
import { generateCharge } from "./charges";
import { userNames } from "./user-names";
import { avatars } from "./users_avatars";

export function generateData(index: number) {
  const getStatus = (i: number): string => {
    if (i % 2 === 0) return "REGISTERED";
    if (i % 3 === 0) return "NOT_COMPLETED";
    if (i % 5 === 0) return "PENDING";
    if (i % 13 === 0) return "REGISTERING";
    if (i % 4 === 0) return "DELETED";
    return "UPDATING";
  };

  const getRandomValue = (from: number, to: number): number => {
    return Math.floor(Math.random() * to) + from;
  };

  const random = getRandomValue(0, 999);
  const user = {
    created_at: new Date().toUTCString(),
    updated_at: null,
    user_name: userNames[random],
    deleted_at: null,
    user_id: randomUUID().toString(),
    register_status: getStatus(index),
  };

  const charge = generateCharge(user);

  const avatarUrl = avatars[random];

  const avatar = {
    avatar_id: randomUUID().toString(),
    user_uuid: user.user_id,
    url: avatarUrl,
    created_at: new Date().toUTCString(),
  };

  return { avatar, charge, user };
}
