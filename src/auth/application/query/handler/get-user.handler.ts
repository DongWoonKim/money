import { Inject, Injectable } from "@nestjs/common";
import { GetUserByEmailQuery, GetUserByIdQuery } from "../get-user.query";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { UserReader } from "src/auth/infrastructure/persistence/user.reader";
import { User } from "src/auth/infrastructure/entity/user.entity";

@Injectable()
@QueryHandler(GetUserByIdQuery)
export class GetUserByIdQueryHandler implements IQueryHandler<GetUserByIdQuery> {
    constructor(
        @Inject('USER_READER')
        private readonly userReader: UserReader,
    ) {}
    execute(query: GetUserByIdQuery): Promise<User | null> {
        const { userId } = query;
        return this.userReader.findById(userId);
    }
}

@Injectable()
@QueryHandler(GetUserByEmailQuery)
export class GetUserByEmailQueryHandler implements IQueryHandler<GetUserByEmailQuery> {
    constructor(
        @Inject('USER_READER')
        private readonly userReader: UserReader,
    ) {}
    async execute(query: GetUserByEmailQuery): Promise<User | null> {
        const { email } = query;
        // Assuming UserReader has a method findByEmail
        return await this.userReader.findByEmail(email);
    }
}
