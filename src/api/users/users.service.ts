import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { Organisation } from '../organisations/entities/organisation.entity';

@Injectable()
export class UsersService {
  constructor (
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Organisation)
    private readonly organisationsRepository: Repository<Organisation>,
    private readonly entityManager: EntityManager
  ) {}
  async create(createUserDto: CreateUserDto) {
    // Hash password
    const salt = await bcrypt.genSalt();
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);

    // Create user and save to db
    let user = this.usersRepository.create(createUserDto);
    await this.usersRepository.save(user);

    // Create organisation for the user and save to db
    let org = this.organisationsRepository.create({
      name: `${createUserDto.firstName}'s Organisation`
    });
    await this.organisationsRepository.save(org);

    org = await this.organisationsRepository.findOne({
      where: { orgId: org.orgId},
      relations: ['users']
    });
    org.users.push(user)
    await this.organisationsRepository.save(org);

    return user;
  }

  async findOne(userId: string) {
    const user = await this.usersRepository.findOne({ where: { userId } });
    if (!user) throw new NotFoundException();

    return {
      status: 'success',
      message: 'Here are your credentials',
      data: user
    }
  }

  findOneByEmail(email: string) {
    const user = this.usersRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException();
    return user
  }
}
