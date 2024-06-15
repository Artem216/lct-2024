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

// // userImage
// export interface IResponseCardFull { // w, h ch, color
//     user_id: number;
//     req_id: number; //id картинки
//     child_s3_url: string;
//     parent_s3_url: string;
//     x: number;
//     y: number;
//     rating: number;
//     prompt: string;
//     width: number;
//     height: number;
//     goal: string;
//     tags: [
//         {
//             "tag": string;
//         }
//     ]; 
// }

export interface IResponseCard {
    id: number;
    user_name: string;
    prompt: string;
    child_s3_url: string;
    parent_s3_url: string;
    rating: number;
}

//user generated img, user card
export interface IResponseImage {
    user_id: number;
    req_id: number; //id картинки
    child_s3_url: string;
    parent_s3_url: string;
    x: number;
    y: number;
    colour: string;
    child_w: number;
    child_h: number;
    rating: number;
    prompt: string;
    width: number;
    height: number;
    goal: string;
    tags: [
        {
            "tag": string;
        }
    ]; 
}

export interface IRating {
    imageId: number;
    changeType: "add" | "delete";
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


        const response = await axios.get<IResponseImage[]>(`${BASE_URL}/api/v1/photo_by_id?q=${imgId}`, config);
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
    async getAllUserCards() {
        let config = {
            headers: {
                Authorization: `Bearer ${storage.getToken()}`
            }
        }


        const response = await axios.get<IResponseImage[]>(`${BASE_URL}/api/v1/all_cards`, config);
        return response.data;
    },
    async getTopCards(topN: number) {
        let config = {
            headers: {
                Authorization: `Bearer ${storage.getToken()}`
            }
        }


        const response = await axios.get<IResponseCard[]>(`${BASE_URL}/api/v1/top_pictures?n=${topN}`, config);
        return response.data;
    },
    async changeRating(data: IRating) {
        let config = {
            headers: {
                Authorization: `Bearer ${storage.getToken()}`
            }
        }


        const response = await axios.get(`${BASE_URL}/api/v1/change_rating?response_id=${data.imageId}&change=${data.changeType}`, config);
        return response;
    },
};
export default ApiImage;