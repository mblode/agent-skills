export type ReferralStatus = "pending" | "completed" | "rewarded";

export interface Referral {
  id: string;
  referrerId: string;
  referredEmail: string;
  status: ReferralStatus;
}

const referralsById = new Map<string, Referral>();

export const referrals = {
  async find(id: string): Promise<Referral | undefined> {
    return referralsById.get(id);
  },
  async save(referral: Referral): Promise<void> {
    referralsById.set(referral.id, referral);
  },
  async setStatus(id: string, status: ReferralStatus): Promise<void> {
    const referral = referralsById.get(id);
    if (referral) referralsById.set(id, { ...referral, status });
  },
};
