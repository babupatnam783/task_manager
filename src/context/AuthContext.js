import { createContext, useState } from "react";
import Cookies from 'js-cookie';

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
    const token = Cookies.get('token') || "";


    const [authState, setAuthState] = useState({
        isAuth: token.length > 0,
        token: token || null,
    });

    const loginUser = (token) => {
        setAuthState({
            isAuth: true,
            token: token,
        });
        Cookies.set('token', token); // Set the token in cookies
    };

    const logoutUser = () => {
        setAuthState({
            isAuth: false,
            token: null,
        });
        Cookies.remove('token'); // Remove the token from cookies on logout
    };

    return (
        <AuthContext.Provider value={{ authState, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;