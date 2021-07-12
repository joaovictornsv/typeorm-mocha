import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UserRepository } from '../repositories/UserRepository';

class UserController {
  create = async (req: Request, res: Response): Promise<Response> => {
    const userData = req.body;

    if (!userData.name || !userData.email) {
      return res.status(400).json({ error: 'Please, fill the required fields' });
    }
    const userRepository = getCustomRepository(UserRepository);

    const userAlreadyExists = await userRepository.findOne({ email: userData.email });

    if (userAlreadyExists) {
      return res.status(400).json({ error: 'This email has already been registered' });
    }

    const user = userRepository.create(userData);

    await userRepository.save(user);

    return res.status(201).json(user);
  }

  index = async (req: Request, res: Response): Promise<Response> => {
    const userRepository = getCustomRepository(UserRepository);
    const users = await userRepository.find();

    return res.status(200).json(users);
  }

  indexByID = async (req: Request, res: Response): Promise<Response> => {
    const userRepository = getCustomRepository(UserRepository);

    const { id } = req.params;

    if (!id.match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/g)) {
      return res.status(400).json({ error: 'Invalid id format' });
    }

    const user = await userRepository.findOne({ id });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(user);
  }
}

export { UserController };
