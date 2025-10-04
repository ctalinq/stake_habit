export interface VisitorDTO {
  commitment_address: string;
  tg_user_full_name: string;
  tg_user_id: number;
  tg_user_photo_link?: string;
}

export interface CommitmentDTO {
  wallet_address: string;
  tg_user_photo_link?: string;
  commitment_address: string;
  tg_user_id: string;
  is_active: boolean;
}

export type CommitmentStatus = "inProcess" | "success" | "failed" | "unknown";
