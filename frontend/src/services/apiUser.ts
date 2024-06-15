import axios from 'axios';
import { IUser, IUserStatistics } from '@/types';
import { BASE_URL } from '../config';
import storage from '@/lib/storage';

const ApiUser = {
    getAllUsers: async () => {
        let config = {
            headers: {
                Authorization: `Bearer ${storage.getToken()}`
            }
        }

        const response = await axios.get<IUser[]>(`${BASE_URL}/api/v1/all_user`, config);
        return response.data;
    },
    getUserStatistics: async () => {
        let config = {
            headers: {
                Authorization: `Bearer ${storage.getToken()}`
            }
        }

        const response = await axios.get<IUserStatistics>(`${BASE_URL}/api/v1/user_registration`, config);
        return response.data;
    },
    raiseUserToAdmin: async (userId: number) => {
        let config = {
            headers: {
                Authorization: `Bearer ${storage.getToken()}`
            }
        }

        const response = await axios.post<IUser>(`${BASE_URL}/api/v1/raise_user?user_id=${userId}`, config);
        return response.data;
    },
    deleteUser: async (userId: number) => {
        let config = {
            headers: {
                Authorization: `Bearer ${storage.getToken()}`
            }
        }

        const response = await axios.delete<IUser>(`${BASE_URL}/api/v1/delete_user?user_id=${userId}`, config);
        return response.data;
    },
    getUserCardsStatistics: async () => {
        let config = {
            headers: {
                Authorization: `Bearer ${storage.getToken()}`
            }
        }

        const response = await axios.get<IUserStatistics>(`${BASE_URL}/api/v1/user_cards_graphic`, config);
        return response.data;
    },
};

export default ApiUser;
