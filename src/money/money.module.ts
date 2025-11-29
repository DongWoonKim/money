import { Module } from "@nestjs/common";
import { HelloController } from "./interface/http/hello.controller";

@Module({
    controllers: [ HelloController ],
    providers: [],
    exports: []
})
export class MoneyModule {}