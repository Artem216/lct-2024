import axios from "axios";
import storage from "../lib/storage";
import { BASE_URL } from '../config';

interface UserLogin {
    username: string;
    password: string;
}

interface CreateUserData {
    email: string;
    password: string;
    name: string;
}

const ApiAuth = {

    async loginUser(data: UserLogin) {
        let config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded', 
                'accept': 'application/json'
            }
        }

        const response = await axios
            .post(`${BASE_URL}/login`, data, config)

        console.log(response.data)
        storage.setToken(response.data["access_token"]);
        // storage.setRole(response.data.role);
        return;
    },

    async singUpUser(data: CreateUserData) {
        const response = await axios
            .post(`${BASE_URL}/signup`, data);

        storage.setToken(response.data["access_token"]);
        // storage.setRole(response.data.role);
        return;
    },
};
export default ApiAuth;