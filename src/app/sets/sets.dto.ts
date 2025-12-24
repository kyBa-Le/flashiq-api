export interface CreateSetDto {
  title: string;
  description?: string;
  isPublic?: boolean;
  ownerId: string;
}
