export abstract class ChargeEntity {
  chargeId: string;
  value: number;
  status: string;
  currency: string;
  paymentMethod: string;
  paymentProvider: string;
  paymentProviderChargeId?: string;
  paymentProviderChargeDetails?: string;
  userUuid: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
}
