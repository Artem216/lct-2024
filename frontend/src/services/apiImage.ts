import axios from "axios";
import storage from "../lib/storage";
import { BASE_URL } from '../config';

interface IGenerate {
    n_variants: number;
    prompt: string;
    width: number;
    height: number;
    goal: string;
    tags?: [
        {
            "tag": string;
        }
    ];
    product: string;
    image_type: string;
    colour: string;
    use_llm: boolean;
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
    status: string;
    tags?: [
        {
            "tag": string;
        }
    ]; 
}


export interface IResponseGenerate {
    id: number;
    status: string;
}

export interface IRating {
    imageId: number;
    changeType: "add" | "delete";
}

interface generateFromFile {
    id_user_from_csv: number; 
    cluster_name: string;
}



const ApiImage = {

    async generate(data: IGenerate) {
        let config = {
            headers: {
                Authorization: `Bearer ${storage.getToken()}`
            }
        }

        const response = await axios.post<IResponseGenerate[]>(`${BASE_URL}/api/v1/predict`, data, config);
        const responseImgs: IResponseImage[] = response.data.map((data) => {
            const imageObg: IResponseImage = {
                user_id: 0,
                req_id: data.id,
                child_s3_url: "",
                parent_s3_url: "",
                x: 0,
                y: 0,
                colour: "",
                child_w: 0,
                child_h: 0,
                rating: 0,
                prompt: "",
                width: 0,
                height: 0,
                goal: "",
                status: data.status
            }
            return imageObg
        })
        
        return responseImgs;
    },
    async generateFromFile(generateDataFile: IGenerate & generateFromFile, dataFile: File) {
        let config = {
            headers: {
                Authorization: `Bearer ${storage.getToken()}`
            }
        }
    
        const formData = new FormData();
        formData.append('file', dataFile);
        formData.append('data', JSON.stringify(generateDataFile)); 

        return await axios.post(`${BASE_URL}/api/v1/videos`, formData, config);
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
    async getCardsByCategory(category: string) {
        let config = {
            headers: {
                Authorization: `Bearer ${storage.getToken()}`
            }
        }

        console.log(`${BASE_URL}/api/v1/cards/${category}`)
        const response = await axios.get<IResponseCard[]>(`${BASE_URL}/api/v1/cards/${category}`, config);
        console.log(response.data)
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