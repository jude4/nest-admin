import { Module } from '@nestjs/common';

@Module({
    imports: [
        TypeOrmModule: featureFor([Product])
    ]
})
export class ProductModule {}
