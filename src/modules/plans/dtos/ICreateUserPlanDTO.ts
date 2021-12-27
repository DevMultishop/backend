export default interface ICreateUserPlanDTO {
  user_id: string;
  plan_id: string;
  limit_usd_cents: number;
  progress_usd_cents: number;
}
