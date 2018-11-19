import { Router } from 'express';
import * as bcrypt from 'bcrypt';

import { User } from '../schemas/User';

const router = Router();

router.route('/').get(async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.route('/:id').get(async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (user) {
      res.send(user);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.route('/check').post(async (req, res) => {
  try {
    const user = await User.findOne({ [req.body.field]: req.body.value });
    if (user) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.route('/login').post(async (req, res) => {
  try {
    if (req.body.user && req.body.password) {
      const { _id, username, name, email, password } = await User.findOne({ $or: [{ username: req.body.user }, { email: req.body.user }] }).select(
        '+password'
      );

      if (_id) {
        const correctPassword = await bcrypt.compare(req.body.password, password);
        if (correctPassword) {
          res.send({
            _id,
            id: _id,
            name,
            username,
            email
          });

          return;
        }
      }
    }

    res.sendStatus(404);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.route('/').post(async (req, res) => {
  try {
    const user = new User();
    user.name = req.body.name;
    user.username = req.body.username;
    user.email = req.body.email;

    const password = await bcrypt.hash(req.body.password, 10);
    user.password = password;

    await user.save();

    res.send({ id: user._id });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.route('/:id').put(async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });

    if (!user) {
      res.sendStatus(404);
    }

    user.name = req.body.name;
    user.username = req.body.username;
    user.email = req.body.email;

    if (req.body.password && req.body.password.length > 0) {
      const password = await bcrypt.hash(req.body.password, 10);
      user.password = password;
    }

    await user.save();

    res.sendStatus(201);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.route('/:id').delete(async (req, res) => {
  try {
    const user = await User.deleteOne({ _id: req.params.id });

    if (user) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

export default router;
