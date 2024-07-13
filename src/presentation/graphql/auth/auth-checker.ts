import { type AuthChecker } from "type-graphql";
import { Context } from "vm";

export const authChecker: AuthChecker<Context> = async (
  { context: { user } },
  roles
): Promise<boolean> => {
  if (!user) {
    return false;
  }

  if (!roles.length) {
    return true;
  }

  const userIsAuth = roles.every((role) => user.roles.includes(role));

  return userIsAuth;
};
