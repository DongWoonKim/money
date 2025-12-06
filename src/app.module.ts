import { Module } from '@nestjs/common';
import { MoneyModule } from './money/money.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ 
    MoneyModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
