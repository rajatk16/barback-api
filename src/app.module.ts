import * as Joi from 'joi';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { MiddlewareConsumer, Module } from '@nestjs/common';

import { AuthModule, UsersModule } from './modules';
import { PrismaModule } from './prisma/prisma.module';
import { RecipesModule } from './modules/recipes/recipes.module';
import { AppLoggerService } from './common/logger/logger.service';
import { LoggingMiddleware } from './middlewares/logging.middleware';
import { HttpExceptionFilter } from './common/exceptions/HttpExceptionFilter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production').required(),
        PORT: Joi.number().default(3000),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.string().default('1h'),
        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),
        DATABASE_URL: Joi.string().required(),
      }),
    }),
    AuthModule,
    RecipesModule,
    UsersModule,
    PrismaModule,
  ],
  providers: [
    AppLoggerService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
