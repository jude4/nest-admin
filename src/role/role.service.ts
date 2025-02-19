import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {

    constructor(
        @InjectRepository(Role) private readonly roleRepository: Repository<Role> 
    ) {}

    async all(): Promise<Role[]> {
        return this.roleRepository.find();
    }

    async findOne(condition): Promise<Role> {
        return this.roleRepository.findOne({
            where: condition
        })
    }

    async create(data): Promise<Role> {
        return this.roleRepository.save(data);
    }

    async update(id: number,data): Promise<any> {
        return this.roleRepository.update(id, data);
    }

    async delete(id: number): Promise<any> {
        return this.roleRepository.delete(id);
    }
}