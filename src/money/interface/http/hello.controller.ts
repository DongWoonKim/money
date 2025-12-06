import { Controller, Get, Req } from '@nestjs/common';

@Controller('hello')
export class HelloController {
  // Define your endpoints and methods here
  @Get()
  sayHello(@Req() req: Request): string {
    console.log('Received request:', req);
    return 'Hello, World!';
  }
}
