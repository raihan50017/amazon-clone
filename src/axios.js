import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://vast-dusk-79447.herokuapp.com'
})

export default instance;