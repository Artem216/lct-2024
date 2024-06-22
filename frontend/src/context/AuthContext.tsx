import { IContextType } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import storage from "@/lib/storage";


const INITIAL_STATE = {
    isAuth: false,
    setIsAuth: () => { },
}

const AuthContext = createContext<IContextType>(INITIAL_STATE)

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuth, setIsAuth] = useState(!!storage.getToken());
    const navigate = useNavigate();

    useEffect(() => {
        if (
            !isAuth
        ) navigate('/sign-in');

    }, [])

    const value = {
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