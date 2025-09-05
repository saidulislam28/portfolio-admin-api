export class UserUpdatedEvent {
  constructor(
    public readonly userId: number,
    public readonly userType: 'user' | 'consultant',
    public readonly updatedFields: string[],
  ) {}
}