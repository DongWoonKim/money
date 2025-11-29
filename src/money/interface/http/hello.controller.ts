import { Controller, Get, Req } from "@nestjs/common";

@Controller("hello")
export class HelloController {
    // Define your endpoints and methods here
    @Get()
    sayHello(@Req() req: Request): string {
        return "Hello, World!";
    }
}
