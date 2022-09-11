import axios from 'axios';

const TIME_OUT = 5000;

const instance = axios.create({
  timeout: TIME_OUT,
  withCredentials: true,
});

instance.interceptors.request.use(req => {
  return req;
});

instance.interceptors.response.use(res => {
  return res;
})

export default instance;
