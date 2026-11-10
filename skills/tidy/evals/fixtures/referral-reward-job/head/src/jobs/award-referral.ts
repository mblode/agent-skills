import { ledger } from "../ledger/store.ts";
import { memberStore } from "../members/store.ts";
import { sendEmail } from "../notify/email.ts";
import { referrals } from "../referrals/store.ts";

export interface ReferralCompleted {
  referralId: string;
}

const REFERRAL_POINTS = 500;

export async function awardReferral(payload: ReferralCompleted): Promise<void> {
  const referral = await referrals.find(payload.referralId);
  if (!referral || referral.status === "rewarded") return;

  const referrer = await memberStore.find(referral.referrerId);
  if (!referrer) return;

  await ledger.credit(referrer.id, REFERRAL_POINTS, "referral");
  await sendEmail(
    referrer.email,
    "You earned 500 points",
    `Thanks for the referral, ${referrer.name}. We added ${REFERRAL_POINTS} points to your balance.`,
  );
  await referrals.setStatus(referral.id, "rewarded");
}
