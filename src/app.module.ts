import { Module } from '@nestjs/common';
import { MoneyModule } from './money/money.module';

@Module({
  imports: [ MoneyModule ],
  controllers: [],
  providers: [],
})
export class AppModule {}
