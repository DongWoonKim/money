import { Controller } from "@nestjs/common";
import { AuthService } from "src/auth/application/service/auth.service";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

}