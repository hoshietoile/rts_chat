import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:4000',
});
instance.interceptors.request.use((config) => {
  config.headers['Content-Type'] = 'application/json';
  config.headers['Access-Control-Allow-Origin'] = '*';
  return config;
});

export default instance;
