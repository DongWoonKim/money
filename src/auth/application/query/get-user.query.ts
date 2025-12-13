
export class GetUserByIdQuery {
    constructor(public readonly userId: string) {}
}

export class GetUserByEmailQuery {
    constructor(public readonly email: string) {}
}
