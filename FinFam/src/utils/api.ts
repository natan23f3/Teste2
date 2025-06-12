import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Substitua pela URL base da sua API
});

export { api };