export interface Note {
  id: string;
  ownerId: string;
  title: string;
  body: string;
  archived: boolean;
  createdAt: number;
}

export interface CreateNoteInput {
  title: string;
  body: string;
}
