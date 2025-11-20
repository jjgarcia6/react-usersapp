import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { findAllPages, save, remove, update } from "../services/userService";
import { useDispatch, useSelector } from "react-redux";
import { initialUserForm, ADD_USER, LOAD_USERS, UPDATE_USER, REMOVE_USER, onUserSelectedForm, onOpenForm, onCloseForm, loadingError } from "../store/slices/users/usersSlice";
import { useAuth } from "../auth/hooks/useAuth";


export const useUsers = () => {

    const {users, userSelected, visibleForm, errors, isLoading, paginator} = useSelector(state => state.users);
    const dispatch = useDispatch();
    
    const navigate = useNavigate();
    const { login, handlerLogout } = useAuth();

    const getUsers = async (page = 0) => {
        try {
            const result = await findAllPages(page);
            dispatch(LOAD_USERS(result.data));            
        } catch (error) {
            if (error.response?.status == 401) { 
                    handlerLogout();
            }  
        }        
    }

    const handlerAddUser = async(user) => {

        if (!login?.isAdmin) return;

        let response;
        try {    
        
            if (user.id === 0) {
                response = await save(user);
                dispatch(ADD_USER(response.data))
            } else {
                response = await update(user);
                dispatch(UPDATE_USER(response.data));
            }

            Swal.fire({
                title: (user.id === 0) ?
                    "User Create" :
                    "User Update",
                text: (user.id === 0) ?
                    "The user has been created successfully!" :
                    "The user has been updated successfully!",
                icon: "success"
            });
            handlerCloseForm();
            navigate('/users');
        } catch (error) {
            if (error.response && error.response.status == 400){
                dispatch(loadingError(error.response.data));
            } else if (error.response && error.response.status == 500 &&
                error.response.data?.message?.includes('constraint')) {
                
                if (error.response.data?.message?.includes('UK_username')) {
                    dispatch(loadingError({ username: 'Username already exists!' }));
                }
                if (error.response.data?.message?.includes('UK_email')) {
                    dispatch(loadingError({ email: 'Email already exists!' }));
                }
                } else if (error.response?.status === 401) { 
                  handlerLogout();
            } else {
                throw error;
            }
        }
    }

    const handlerRemoveUser = (id) => {

        if (!login?.isAdmin) return;

        Swal.fire({
            title: "Are you sure?",
            text: "Caution, the user will be deleted permanently!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then( async (result) => {
            if (result.isConfirmed) {

                try {
                    await remove(id);
                    dispatch(REMOVE_USER(id));
                Swal.fire({
                    title: "User Deleted!",
                    text: "The user has been deleted successfully!",
                    icon: "success"
                });
                } catch (error) {
                    if (error.response?.status == 401) { 
                        handlerLogout();
                    }                
                }  
            }
        });
    }

    const handlerUserSelectedForm = (user) => {
        dispatch(onUserSelectedForm({ ...user }));
    }

    const handlerOpenForm = () => {
        dispatch(onOpenForm());
    }

    const handlerCloseForm = () => {
        dispatch(onCloseForm());
        dispatch(loadingError({}));
    }


    return {
        users,
        userSelected,
        initialUserForm,
        visibleForm,
        errors,
        isLoading,
        paginator,
        handlerAddUser,
        handlerRemoveUser,
        handlerUserSelectedForm,
        handlerOpenForm,
        handlerCloseForm,
        getUsers,
    }
}
