import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoneyModule } from './money/money.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

// 데이터베이스 연결 매핑: [연결명, 데이터베이스명]
const DATABASE_CONNECTIONS = {
  default: 'money',
  // db_auth: '',
  // db_log: '',
} as const;

@Module({
  imports: [
    MoneyModule,
    AuthModule,
    UserModule,
    // 환경 변수 로드
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'src/config/db/.env',
    }),

    // 다중 데이터베이스 연결
    ...Object.entries(DATABASE_CONNECTIONS).map(([name, database]) =>
      TypeOrmModule.forRootAsync({
        name,
        useFactory: async () => ({
          name,
          type: 'mysql',
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT || '3306'),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database,
          synchronize: process.env.NODE_ENV === 'development',
          autoLoadEntities: true,
          timezone: 'Z',  // UTC로 저장, 애플리케이션에서 KST 변환
          logging: process.env.DB_LOGGING === 'true',
          charset: 'utf8mb4',
        }),
      }),
    ),
    
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
