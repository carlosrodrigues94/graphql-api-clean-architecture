import { randomUUID } from "crypto";

export class ChargeEntity {
  charge_id: string;
  id?: number;
  status: number;
  value: number;
  payment_method: string;
  payment_provider: string;
  payment_provider_charge_id: string;
  payment_provider_charge_details?: Record<string, any>;
  user_uuid: string;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
  currency: string;
}

export const generateCharge = (user): ChargeEntity => {
  const isEven = user.id % 2 === 0;
  const charge: ChargeEntity = {
    charge_id: randomUUID().toString(),
    created_at: new Date().toUTCString(),
    payment_method: isEven ? "CREDIT_CARD" : "PIX",
    payment_provider: "",
    payment_provider_charge_id: randomUUID().toString(),
    status: isEven ? 1 : 2,
    user_uuid: user.user_id,
    value: Math.floor(Math.random()),
    currency: isEven ? "BRL" : "USD",
  };

  return charge;
};
