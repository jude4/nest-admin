import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { RoleModule } from './role/role.module';
import { ProductService } from './product/product.service';
import { ServiceModule } from './service/service.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 33066,
      username: 'root',
      password: 'root',
      database: 'admin',
      autoLoadEntities: true, // dont use on production environment because it will load all entities and always migrate the database
      synchronize: true,
    }),
    AuthModule,
    CommonModule,
    RoleModule,
    ServiceModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService, ProductService],
})
export class AppModule {}
