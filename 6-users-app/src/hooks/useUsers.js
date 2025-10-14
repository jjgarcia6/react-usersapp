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

export const useUsers = () => {

    const [users, dispatch] = useReducer(usersReducers, initialUsers);
    const [userSelected, setUserSelected] = useState(initialUserForm);
    const [visibleForm, setVisibleForm] = useState(false);
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
    }


    return {
        users,
        userSelected,
        initialUserForm,
        visibleForm,
        handlerAddUser,
        handlerRemoveUser,
        handlerUserSelectedForm,
        handlerOpenForm,
        handlerCloseForm,
        getUsers,
    }
}
