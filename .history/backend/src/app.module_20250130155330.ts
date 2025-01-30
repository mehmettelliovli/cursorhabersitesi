import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './entities/user.entity';
import { News } from './entities/news.entity';
import { Category } from './entities/category.entity';
import { AuthModule } from './auth/auth.module';
import { NewsModule } from './news/news.module';
import { UsersModule } from './users/users.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_G6Y0NZFjpTVt@ep-still-tree-a968kvqw-pooler.gwc.azure.neon.tech/neondb?sslmode=require',
      entities: [User, News, Category],
      synchronize: true,
    }),
    AuthModule,
    NewsModule,
    UsersModule,
    CategoryModule,
  ],
})
export class AppModule {}
