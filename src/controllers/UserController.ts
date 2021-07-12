import { UserRepository } from '../repositories/UserRepository';

class UserController {
  private readonly userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }
}

export { UserController };
