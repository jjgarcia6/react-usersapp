import { useReducer } from "react";
import { loginReducer } from "../reducers/loginReducer";
import Swal from "sweetalert2";
import { loginUser } from "../services/authServices";
import { useNavigate } from "react-router-dom";

const initialLogin = JSON.parse(sessionStorage.getItem('login')) || {
    isAuth: false,
    isAdmin: false,
    user: undefined,
}
export const useAuth = () => {

    const [login, dispatch] = useReducer(loginReducer, initialLogin);
    const navigate = useNavigate();
    
    const handlerLogin = async ({ username, password }) => {
        
        try {
            const response = await loginUser({ username, password });
            const token = response.data.token;
            const claims = JSON.parse(window.atob(token.split('.')[1]));
            console.log(claims);
            const user = { username: claims.username };
            dispatch({
                type: 'login',
                payload: {user , isAdmin: claims.isAdmin},
            });
            sessionStorage.setItem('login', JSON.stringify({
                isAuth: true,
                isAdmin: claims.isAdmin,
                user,
            }));
            sessionStorage.setItem('token', `Bearer ${token}`);
            navigate('/users');
        } catch (error) {
            if (error.response?.status === 401) {
                Swal.fire({
                title: 'Login Error',
                text: 'Username or Password are invalid',
                icon: 'error'
            });
            } else if (error.response?.status == 403) {
                Swal.fire({
                title: 'Login Error',
                text: 'You do not have access to the resource or permissions',
                icon: 'error'
            });
            } else {
                throw error;
            }       
        }
    }

    const handlerLogout = () => {
        dispatch({
            type: 'logout',
        });
        sessionStorage.removeItem('login');
        sessionStorage.removeItem('token');
        sessionStorage.clear();
    }
    return {
        login,
        handlerLogin,
        handlerLogout,
    }
}