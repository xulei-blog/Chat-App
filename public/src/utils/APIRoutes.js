const host = 'http://localhost:5000';
const registerRoute = `${host}/api/auth/register`;
const loginRoute = `${host}/api/auth/login`;
const setAvatarRoute = `${host}/api/auth/setAvatar`;
const allUsersRoute = `${host}/api/auth/allusers`;
const sendMessageRoute = `${host}/api/messages/addmsg`;
const getAllMessagesRoute = `${host}/api/messages/getmsg`;

export {
  host,
  registerRoute,
  loginRoute,
  setAvatarRoute,
  allUsersRoute,
  sendMessageRoute,
  getAllMessagesRoute,
}