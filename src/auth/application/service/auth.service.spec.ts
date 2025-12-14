import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthService } from './auth.service';
import { GetUserByEmailQuery } from '../query/get-user.query';
import { CreateUserCommand } from '../command/create-user.command';
import { User } from 'src/auth/infrastructure/entity/user.entity';
import bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
    let authService: AuthService;
    let queryBus: jest.Mocked<QueryBus>;
    let commandBus: jest.Mocked<CommandBus>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: QueryBus,
                    useValue: {
                        execute: jest.fn(),
                    },
                },
                {
                    provide: CommandBus,
                    useValue: {
                        execute: jest.fn(),
                    },
                },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        queryBus = module.get(QueryBus);
        commandBus = module.get(CommandBus);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('signup', () => {
        const email = 'test@example.com';
        const password = 'Password123!';
        const nickname = '테스트유저';
        const hashedPassword = 'hashed_password_123';

        it('신규 유저 회원가입 성공', async () => {
            // Given
            const mockUser: Partial<User> = {
                id: '1',
                email,
                nickname,
                password: hashedPassword,
            };

            queryBus.execute.mockResolvedValue(null); // 기존 유저 없음
            (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
            commandBus.execute.mockResolvedValue(mockUser as User);

            // When
            await authService.signup(email, password, nickname);

            // Then
            expect(queryBus.execute).toHaveBeenCalledWith(
                new GetUserByEmailQuery(email)
            );
            expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
            expect(commandBus.execute).toHaveBeenCalledWith(
                new CreateUserCommand(email, hashedPassword, nickname)
            );
        });

        it('이미 존재하는 이메일로 회원가입 시 에러 발생', async () => {
            // Given
            const existingUser: Partial<User> = {
                id: '1',
                email,
                nickname: '기존유저',
            };

            queryBus.execute.mockResolvedValue(existingUser as User);

            // When & Then
            await expect(
                authService.signup(email, password, nickname)
            ).rejects.toThrow('Email already in use');

            expect(queryBus.execute).toHaveBeenCalledWith(
                new GetUserByEmailQuery(email)
            );
            expect(bcrypt.hash).not.toHaveBeenCalled();
            expect(commandBus.execute).not.toHaveBeenCalled();
        });

        it('비밀번호가 bcrypt로 해시되어야 함', async () => {
            // Given
            queryBus.execute.mockResolvedValue(null);
            (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
            commandBus.execute.mockResolvedValue({} as User);

            // When
            await authService.signup(email, password, nickname);

            // Then
            expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
            expect(commandBus.execute).toHaveBeenCalledWith(
                expect.objectContaining({
                    password: hashedPassword, // 해시된 비밀번호가 전달되어야 함
                })
            );
        });
    });
});
