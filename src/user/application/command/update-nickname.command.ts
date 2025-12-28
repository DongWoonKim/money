export class UpdateNicknameCommand {
  constructor(
    public readonly userId: string,
    public readonly nickname: string,
  ) {}
}
