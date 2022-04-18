import axios from 'axios';

export default axios.create({
  baseUrl: '',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
});
