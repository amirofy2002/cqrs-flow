export interface ICommandHandler<ICommand> {
  execute(command: ICommand): Promise<any>
}
