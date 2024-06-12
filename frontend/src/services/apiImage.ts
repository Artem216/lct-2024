import axios from "axios";
import storage from "../lib/storage";
import { BASE_URL } from '../config';

interface IGenerate {
    n_variants: number;
    prompt: string;
    width: number;
    height: number;
    goal: string;
    tags: [
        {
            "tag": string;
        }
    ];
    product: string;
    image_type: string;
    colour: string;
}


const ApiImage = {

    async generate(data: IGenerate) {
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

};
export default ApiImage;