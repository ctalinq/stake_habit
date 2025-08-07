export interface VisitorDTO {
  full_name: string;
  photo_url?: string;
}

export interface CommitmentDTO {
  users: VisitorDTO[];
}

export type VisitorsDTO = {
  [commitmentAddress: string]: CommitmentDTO;
};
