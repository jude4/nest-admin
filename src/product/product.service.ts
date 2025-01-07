import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductService {
    constructor(@InjectRepository(Product) private readonly productRepository: Repository) {}
}
