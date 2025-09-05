export class BulkUserUpdatedEvent {
  constructor(
    public readonly users: Array<{
      id: number;
      type: 'user' | 'consultant';
      updatedFields: string[];
    }>,
  ) {}
}