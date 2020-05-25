import axios from 'axios';
import {apiURL} from "./constants";

const instance = axios.create({
    baseURI: apiURL
});

export default instance;