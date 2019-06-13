import { Response, Request } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User, IUser } from '../schemas/User';

export default class UserController {
  public async register(req: Request, res: Response) {
    try {
      if (req.body.name && req.body.username && req.body.email && req.body.password) {
        if (await User.findOne({ username: req.body.username })) {
          res.status(404).send({ error: true, message: 'Username already exists.' });
        }

        if (await User.findOne({ email: req.body.email })) {
          res.status(404).send({ error: true, message: 'Email already exists.' });
        }

        let user: IUser = new User();
        user.name = req.body.name;
        user.username = req.body.username;
        user.email = req.body.email;
        user.password = await bcrypt.hash(req.body.password, 10);

        await user.save();

        const token = jwt.sign(user.toJSON(), 'shhhhh');

        res.status(200).send({ error: false, user: user, token });
      } else {
        res.status(404).send({
          error: true,
          message: 'There are fields that were not filled.'
        });
      }
    } catch (error) {
      res.status(404).send({ error: true });
    }
  }

  public async login(req: Request, res: Response) {
    try {
      if (req.body.user && req.body.password) {
        const user = await User.findOne({ $or: [{ username: req.body.user }, { email: req.body.user }] }).select('+password');

        if (user && (await bcrypt.compare(req.body.password, user.password))) {
          const token = jwt.sign(user.toJSON(), 'shhhhh');

          let userObject = user.toObject();
          delete userObject.password;

          res.status(200).send({ error: false, user: userObject, token });
        } else {
          res.status(404).send({
            error: true,
            message: 'Incorrect user or password.'
          });
        }
      } else {
        res.status(404).send({
          error: true,
          message: 'There are fields that were not filled.'
        });
      }
    } catch (error) {
      console.log(error);
      res.status(404).send({ error: true });
    }
  }
}
