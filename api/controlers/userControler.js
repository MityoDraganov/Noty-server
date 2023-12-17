const bcrypt = require("bcrypt");
const jwtPromises = require("../lib/jwtPromisifier");
const { secret } = require("../config");

const userModel = require("../models/user");

const dataValidation = require("../services/dataValidation");

async function userCreationPost(req, res) {
  try {
    const data = req.body;

    const { password, rePassword, username, email } = data;



    const existingUser = await userModel.findOne({ email: email });

    if (existingUser) {
      throw new Error("User already registerd!");
    }


    const validation = dataValidation.userCreationValidation(
      password,
      rePassword,
      username,
      email
    );
    if (validation !== null) {
      throw new Error(validation);
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({ ...data, password: hash });

    const token = await jwtPromises.sign(
      { email: email, _id: user._id },
      secret
    );
    res.send(
      JSON.stringify({
        'authorization-token': token,
        _id: user._id,
        'firstName': user.firstName,
        'lastName': user.lastName,
        'phoneNumber': user.phoneNumber
        //'imageUrl': rest.imageUrl,
        //'email' : rest.email
      })
    );
    res.end();
  } catch (error) {
    res.status(400).send(JSON.stringify({ Message: error.message }));
  }
}

async function userLogin(req, res) {
  try {
    console.log('user login request catched');
    const { email, password } = { ...req.body };

    const user = await userModel.findOne({ email: email });

    const validation = dataValidation.userLoginValidation(
      email,
      password,
      user
    );

    if (validation !== null) {
      throw new Error(validation);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error("Wrong email or password");
    }

    const token = await jwtPromises.sign(
      { email: email, _id: user._id },
      secret
    );

    res.send(
      JSON.stringify({
        'authorization-token': token,
        _id: user._id,

        'firstName': user.firstName,
        'lastName': user.lastName,
        'phoneNumber': user.phoneNumber
        //'imageUrl': rest.imageUrl,
        //'email' : rest.email
      })
    );
  } catch (e) {
    res.status(401).send({ error: "Unauthorized: " + e.message });
  }
}

async function getUserInfo(req, res) {
  const userTokenCredentials = req.userTokenCredentials

  const user = await userModel.findById(userTokenCredentials._id).populate("purchaseHistory")

  res.send(JSON.stringify({
    firstName: user.firstName,
    lastName: user.lastName,
    purchaseHistory: user.purchaseHistory
  }))
}

module.exports = { userCreationPost, userLogin, getUserInfo };
