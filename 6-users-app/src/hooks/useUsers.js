import { useReducer, useState } from "react";
import { usersReducers } from "../reducers/usersReducers";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { findUsers, save, remove, update } from "../services/userService";

const initialUsers = [];

const initialUserForm = {
    id: 0,
    username: "",
    password: "",
    email: "",
}

const initialErrors = {
    username: "",
    password: "",
    email: "",
}

export const useUsers = () => {

    const [users, dispatch] = useReducer(usersReducers, initialUsers);
    const [userSelected, setUserSelected] = useState(initialUserForm);
    const [visibleForm, setVisibleForm] = useState(false);
    
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const getUsers = async () => {
        const result = await findUsers();
        console.log(result);
        dispatch({
            type: 'LOAD_USERS',
            payload: result.data,
        });
    }

    const handlerAddUser = async(user) => {
        //console.log(user);

        let response;
        try {    
        
            if (user.id === 0) {
                response = await save(user);
            } else {
                response = await update(user);
            }

            dispatch({
                type: (user.id === 0) ? 'ADD_USER' : 'UPDATE_USER',
                payload: response.data,
            });

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
                setErrors(error.response.data);
            } else if (error.response && error.response.status == 500 &&
                error.response.data?.message?.includes('constraint')) {
                
                if (error.response.data?.message?.includes('UK_username')) {
                    setErrors({ username: 'Username already exists!' });
                }
                if (error.response.data?.message?.includes('UK_email')) {
                    setErrors({ email: 'Email already exists!' });
                }
            } else {
                throw error;
            }
        }
    }

    const handlerRemoveUser = (id) => {
        //console.log(id);

        Swal.fire({
            title: "Are you sure?",
            text: "Caution, the user will be deleted permanently!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                remove(id);
                dispatch({
                    type: 'REMOVE_USER',
                    payload: id,
                });
                Swal.fire({
                    title: "User Deleted!",
                    text: "The user has been deleted successfully!",
                    icon: "success"
                });
            }
        });
    }

    const handlerUserSelectedForm = (user) => {
        //console.log(user);
        setVisibleForm(true);
        setUserSelected({ ...user });
    }

    const handlerOpenForm = () => {
        setVisibleForm(true);
    }

    const handlerCloseForm = () => {
        setVisibleForm(false);
        setUserSelected(initialUserForm);
        setErrors({});
    }


    return {
        users,
        userSelected,
        initialUserForm,
        visibleForm,
        errors,
        handlerAddUser,
        handlerRemoveUser,
        handlerUserSelectedForm,
        handlerOpenForm,
        handlerCloseForm,
        getUsers,
    }
}
