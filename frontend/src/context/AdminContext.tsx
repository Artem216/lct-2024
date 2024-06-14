import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import ApiUser from '@/services/apiUser';
import { IUser, IUserStatistics } from '@/types';

interface AdminContextProps {
    users: IUser[];
    setUsers: React.Dispatch<React.SetStateAction<IUser[]>>;
    userStatistics: IUserStatistics;
    setUserStatistics: React.Dispatch<React.SetStateAction<IUserStatistics>>;
}

const AdminContext = createContext<AdminContextProps | undefined>(undefined);

const AdminProvider = ({ children }: { children: ReactNode }) => {
    const [users, setUsers] = useState<IUser[]>([]);
    const [userStatistics, setUserStatistics] = useState<IUserStatistics>({ x: [], y: [] });

    const { toast } = useToast();

    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await ApiUser.getAllUsers();
                setUsers(response);
                console.log(response)
            } catch (error) {
                toast({
                    title: "Ошибка получения пользователей. Попробуйте снова",
                    variant: "destructive",
                });
            }
        }

        async function fetchUserStatistics() {
            try {
                const response = await ApiUser.getUserStatistics();
                setUserStatistics(response);
                console.log(response);
            } catch (error) {
                toast({
                    title: "Ошибка получения статистики пользователей. Попробуйте снова",
                    variant: "destructive",
                });
            }
        }

        fetchUsers();
        fetchUserStatistics();
    }, []);

    return (
        <AdminContext.Provider value={{ users, setUsers, userStatistics, setUserStatistics }}>
            {children}
        </AdminContext.Provider>
    );
};

const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
};

export { AdminProvider, useAdmin };
