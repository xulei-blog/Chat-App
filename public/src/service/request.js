import axios from 'axios';

const TIME_OUT = 5000;

const instance = axios.create({
  timeout: TIME_OUT
});

instance.interceptors.request.use(req => {
  const token = localStorage.getItem('chat-app-token');
  if (token) {
    req.headers["Authorization"] = `Bearer ${token}`;
  }
  return req;
});

instance.interceptors.response.use(res => {
  if (res.data.token) {
    localStorage.setItem('chat-app-token', res.data.token);
  }
  return res;
})

export default instance;
