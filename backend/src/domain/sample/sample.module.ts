import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SampleEntity } from './sample.entity';
import { SampleService } from './sample.service';
import { SampleController } from './sample.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SampleEntity])],
  providers: [SampleService],
  controllers: [SampleController],
})
export class SampleModule {}
