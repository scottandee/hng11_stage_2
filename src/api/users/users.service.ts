import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Organisation } from '../organisations/entities/organisation.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Organisation)
    private readonly organisationsRepository: Repository<Organisation>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    // Hash password
    const salt = await bcrypt.genSalt();
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);

    // Create user and save to db
    const user = this.usersRepository.create(createUserDto);
    await this.usersRepository.save(user);

    // Create organisation for the user and save to db
    let org = this.organisationsRepository.create({
      name: `${createUserDto.firstName}'s Organisation`,
    });
    await this.organisationsRepository.save(org);

    org = await this.organisationsRepository.findOne({
      where: { orgId: org.orgId },
      relations: ['users'],
    });
    org.users.push(user);
    await this.organisationsRepository.save(org);

    return user;
  }

  async findOne(userId: string, reqId: string) {
    const user = await this.usersRepository.findOne({
      where: { userId: reqId },
      relations: { organisations: true }
    });
    const organisationIds = user.organisations.map(org => org.orgId);
    console.log(organisationIds)
    const users = await this.usersRepository
      .createQueryBuilder('user')
      .innerJoin('user.organisations', 'organisation')
      .where('organisation.orgId IN (:...organisationIds)', { organisationIds })
      .getMany();
    console.log(users)
    for (let user of users) {
      if (user.userId === userId) {
        return {
          status: 'success',
          message: 'Here are your credentials',
          data: user,
        }; 
      }
    }
    throw new ForbiddenException();
  }

  findOneByEmail(email: string) {
    const user = this.usersRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException();
    return user;
  }
}
