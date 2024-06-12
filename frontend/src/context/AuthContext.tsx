import { IContextType, IUser } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import storage from "@/lib/storage";

export const INITIAL_USER: IUser = {
    id: '',
    name: '',
    username: '',
    email: '',
    imageUrl: '',
    bio: '',
}

const INITIAL_STATE = {
    isLoading: false,
    isAuth: false,
    setIsAuth: () => { },
}

const AuthContext = createContext<IContextType>(INITIAL_STATE)

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isAuth, setIsAuth] = useState(!!storage.getToken());

    const navigate = useNavigate();

    useEffect(() => {
        if (
            !isAuth
        ) navigate('/sign-in');

    }, [])

    const value = {
        isLoading,
        isAuth,
        setIsAuth,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;

export const useUserContext = () => useContext(AuthContext);