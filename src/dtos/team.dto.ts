export class CreateTeamDto {
  name: string;
  description: string;
  userId: number;
}

export class UpdateTeamDto {
  name?: string;
  description?: string;
}
