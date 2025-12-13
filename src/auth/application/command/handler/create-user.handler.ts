import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateUserCommand } from "../create-user.command";
import { User } from "src/auth/infrastructure/entity/user.entity";
import { Inject } from "@nestjs/common";
import { UserWriter } from "src/auth/infrastructure/persistence/user.writer";

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand> {
    constructor(
        @Inject('USER_WRITER')
        private readonly userWriter: UserWriter,
    ) {}
    execute(command: CreateUserCommand): Promise<User> {
        const { email, password, nickname } = command;
        return this.userWriter.createUser({ email, password, nickname });
    }
}