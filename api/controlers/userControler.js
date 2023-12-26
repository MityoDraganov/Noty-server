const bcrypt = require("bcrypt");
const jwtPromises = require("../lib/jwtPromisifier");
const { secret } = require("../config");

const userModel = require("../models/user");

const dataValidation = require("../services/dataValidation");
const notificationModel = require("../models/notification");

async function userCreationPost(req, res) {
    try {
        const { password, rePassword, username, email } = req.body;



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

        const user = await userModel.create({ ...req.body, password: hash });

        const token = await jwtPromises.sign(
            { email: email, _id: user._id },
            secret
        );
        res.send(
            JSON.stringify({
                'authorization-token': token,
                _id: user._id
            })
        );
        res.end();
    } catch (error) {
        res.status(400).send(JSON.stringify({ Message: error.message }));
    }
}

async function userLogin(req, res) {
    try {
        const { email, password } = req.body;

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
                _id: user._id
            })
        );
    } catch (e) {
        res.status(401).send({ error: "Unauthorized: " + e.message });
    }
}

async function getUserInfo(req, res) {
    const userTokenCredentials = req.userTokenCredentials

    const user = await userModel.findById(userTokenCredentials._id)

    const notifications = await notificationModel.find({
        addressedTo: user._id
    }).populate("project")
    .populate("sentBy")
    .populate("addressedTo")

    res.send(JSON.stringify({
        username: user.username,
        email: user.email,
        notifications: notifications
    }))
}

async function searchUser(req, res) {
    try {
        const ownerCredentials = req.userTokenCredentials;
        const { username } = req.body;

        if (!username) {
            throw new Error("Username is required for search");
        }

        const users = await userModel.find({ username: { $regex: username, $options: 'i' } });

        const filteredUsers = users
            .filter(user => user._id.toString() !== ownerCredentials._id.toString())
            .map(user => ({
                _id: user._id,
                username: user.username,
                email: user.email,
            }));

        res.send(JSON.stringify(filteredUsers));
    } catch (e) {
        res.status(400).send({ error: "Bad Request: " + e.message });
    }
}


module.exports = { userCreationPost, userLogin, getUserInfo, searchUser };
