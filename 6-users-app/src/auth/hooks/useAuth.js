import Swal from "sweetalert2";
import { loginUser } from "../services/authServices";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { onLogin, onLogout, onInitLogin } from "../../store/slices/auth/authSlice";

export const useAuth = () => {

    const dispatch = useDispatch();
    const { user, isAdmin, isAuth } =  useSelector(state => state.auth);

    const navigate = useNavigate();
    
    const handlerLogin = async ({ username, password }) => {
        
        try {
            dispatch(onInitLogin());
            const response = await loginUser({ username, password });
            const token = response.data.token;
            const claims = JSON.parse(window.atob(token.split('.')[1]));
            // Normalize authorities which some backends return as a JSON string
            let parsedAuthorities = [];
            if (claims.authorities) {
                try {
                    parsedAuthorities = (typeof claims.authorities === 'string')
                        ? JSON.parse(claims.authorities)
                        : claims.authorities;
                } catch (e) {
                    parsedAuthorities = claims.authorities || [];
                }
            }
            // Determine admin flag: explicit claim or roles array
            const derivedIsAdmin = Boolean(claims.isAdmin) || parsedAuthorities.some(a => {
                if (!a) return false;
                // handle forms: {authority: 'ROLE_ADMIN'} or 'ROLE_ADMIN'
                if (typeof a === 'string') return a === 'ROLE_ADMIN';
                return a.authority === 'ROLE_ADMIN' || a === 'ROLE_ADMIN';
            });

            if (import.meta.env.DEV) {
                console.debug('[useAuth] claims:', claims);
                console.debug('[useAuth] parsedAuthorities:', parsedAuthorities);
                console.debug('[useAuth] derivedIsAdmin:', derivedIsAdmin);
            }

            const user = { username: claims.username };
            dispatch(onLogin({ user, isAdmin: derivedIsAdmin }));

            sessionStorage.setItem('login', JSON.stringify({
                isAuth: true,
                isAdmin: derivedIsAdmin,
                user,
            }));
            sessionStorage.setItem('token', `Bearer ${token}`);
            navigate('/users');
        } catch (error) {
            dispatch(onLogout());
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
        dispatch(onLogout());
        sessionStorage.removeItem('login');
        sessionStorage.removeItem('token');
        sessionStorage.clear();
    }
    return {
        login:{
            user,
            isAdmin,
            isAuth,
        },
        handlerLogin,
        handlerLogout,
    }
}