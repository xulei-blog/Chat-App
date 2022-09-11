const User = require('../model/usersModel');
const bcrypt = require('bcrypt');

const { genToken } = require('../token/util')

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: 'Username already used', status: false });
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: 'Email already used', status: false });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    delete user.password;
    let token = genToken({username, hashedPassword}, {
      expiresIn: 24 * 60 * 60,
      algorithm: 'HS256'
    });
    res.cookie('token', token, {
      maxAge: 1000 * 60 * 60 * 24,
      path: '/',
    })
    return res.json({ status: true, user});
  } catch (ex) {
    next(ex);
  }
}

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res.json({ msg: 'Incorrect username or password', status: false });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({ msg: 'Incorrect username or password', status: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // let token = jwt.sign({ username, hashedPassword }, SECRET_KEY, {
    //   expiresIn: 24 * 60 * 60,
    //   algorithm: 'HS256'
    // });
    let token = genToken({username, hashedPassword}, {
      expiresIn: 24 * 60 * 60,
      algorithm: 'HS256'
    });
    res.cookie('token', token, {
      maxAge: 1000 * 60 * 60 * 24,
      path: '/',
      httpOnly: true,
    })
    return res.json({ status: true, user});
} catch (ex) {
  next(ex);
}
}

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(userId, {
      isAvatarImageSet: true,
      avatarImage,
    });
    return res.json({ isSet: userData.isAvatarImageSet, image: userData.avatarImage });
  } catch (ex) {
    next(ex)
  }
}

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email", 'username', 'avatarImage', 'id',
    ]);

    return res.json(users);
  } catch (ex) {
    next(ex);
  }
}