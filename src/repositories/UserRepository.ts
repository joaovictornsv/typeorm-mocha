import { Repository } from 'typeorm';
import { User } from '../entities/User';

class UserRepository extends Repository<User> {}

export { UserRepository };
