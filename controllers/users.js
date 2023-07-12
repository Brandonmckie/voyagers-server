import User from "../models/User.js";
import userService from "../services/userService.js";
import stripe from "../utils/stripe.js";

class UserController {
  async login(req, res) {
    try {

      let { values, isValid, errors } = userService.validateLoginInput(req.body);

      if (!isValid) {
        return res.status(400).json(errors);
      }

      let { status, token, error } = await userService.loginUser(values);

      if (status === "OK") {
        return res.send({ token });
      } else {
        return res.status(401).json(error || { error: "email/password is wrong" });
      }
    } catch (err) { console.log(console.log(err)) }
  }

  async addUser(req, res) {
    try {
      let { values, errors, isValid } = userService.validateRegisterInput(req.body);

      if (!isValid) {
        return res.status(400).json(errors);
      }

      const { status, error, token } = await userService.addUser(values);

      if (status === "OK") {
        return res.status(201).send({ token });
      } else {
        return res.status(400).send(error);
      }
    } catch (error) {
      console.log(error)
    }
  }

  async getUser(req, res) {
    try {

      const user = await User.findById(req.user.id).select("+email +accountId");

      const destinationAccount = await stripe.accounts.retrieve(user.accountId);
      res.send({
        user: { ...user._doc, stripeConnected: destinationAccount?.capabilities?.transfers === "active" },
      });

      if (user) {
        let updatedUser = await User.findByIdAndUpdate(req.user.id, {
          $set: { stripeConnected: destinationAccount?.capabilities?.transfers === "active" },
        });
        console.log(updatedUser);
        return;
      } else {
        return res.status(400).send({ error: "Something went wrong" });
      }
    } catch (err) { console.log(err) }
  }

  verifyToken(req, res) {
    try {
      return res.status(200).json({ message: "Token verified" });
    } catch (error) {
      console.log(error);
    }
  }

  async updateUser(req, res) {
    try {

      let image;
      if (req.file) {
        image = process.env.BASE_URL + "/img/" + req.file?.filename;
      }

      const user = await userService.updateUser({ ...req.body, image }, req.user.id);

      return res.send(user);
    } catch (err) { console.log(err) }
  }
}

export default new UserController();
