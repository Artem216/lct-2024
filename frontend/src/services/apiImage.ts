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

export interface IResponseImage {
    id: number;
    status: string;
    s3_url?: string;
}


const ApiImage = {

    async generate(data: IGenerate) {
        let config = {
            headers: {
                Authorization: `Bearer ${storage.getToken()}`
            }
        }

        const response = await axios.post<IResponseImage[]>(`${BASE_URL}/api/v1/predict`, data, config);
        return response.data;
    },
    async getImageById(imgId: number) {
        let config = {
            headers: {
                Authorization: `Bearer ${storage.getToken()}`
            }
        }


        const response = await axios.get<IResponseImage[]>(`${BASE_URL}/api/v1/photo_by_id??q=${imgId}`, config);
        return response.data[0];
    },
    async getSeveralImagesByIds(imgIds: number[]) {
        let config = {
            headers: {
                Authorization: `Bearer ${storage.getToken()}`
            }
        }

        let query = ""
        imgIds.forEach((id) => {
            query += `q=${id}&`
        })
        query = query.slice(0, -1);

        const response = await axios.get<IResponseImage[]>(`${BASE_URL}/api/v1/photo_by_id?${query}`, config);
        return response.data;
    },
};
export default ApiImage;