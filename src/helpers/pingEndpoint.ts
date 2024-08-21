import axios from 'axios';

import apiBaseUrl from './apiBaseUrl.js';

const pingEndpoint = () => {
  setInterval(async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/ping`);

      console.log('Ping response:', response.data);
    } catch (error) {
      console.error('Erro ao fazer ping:', error);
    }
  }, 840000); // 14 minutos
};

export default pingEndpoint;
