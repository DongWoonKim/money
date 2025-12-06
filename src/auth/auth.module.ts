import { Module } from "@nestjs/common";
import { AuthController } from "./interface/http/auth.controller";

@Module({
    controllers: [AuthController],
    providers: [],
    exports: []
})
export class AuthModule {}