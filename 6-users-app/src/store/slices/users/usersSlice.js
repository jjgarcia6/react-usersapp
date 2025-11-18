import { createSlice } from "@reduxjs/toolkit";

export const initialUserForm = {
    id: 0,
    username: "",
    password: "",
    email: "",
    admin: false,
}
const initialErrors = {
    username: "",
    password: "",
    email: "",
};

export const usersSlice = createSlice({
    name: 'users',
    initialState: {
        users: [],
        userSelected: initialUserForm,
        visibleForm: false,
        errors: initialErrors,
    },
    reducers: {
        ADD_USER: (state, {payload}) => {
            state.users = [
                ...state.users,
                {
                    ...payload
                }
            ];
            state.userSelected = initialUserForm;
            state.visibleForm = false;
        },
        REMOVE_USER: (state, {payload}) => {
            state.users = state.users.filter(user => user.id !== payload);
        },
        UPDATE_USER: (state, {payload}) => {
            state.users = state.users.map(u => {
                if (u.id === payload.id) {
                    return {
                        ...payload,
                    };
                }
                return u;
            });
            state.userSelected = initialUserForm;
            state.visibleForm = false;
        },
        LOAD_USERS: (state, {payload}) => {
            state.users = payload;
        },
        onUserSelectedForm: (state, {payload}) => {
            state.userSelected = payload;
            state.visibleForm = true;
        },
        onOpenForm: (state) => {
            state.visibleForm = true;       
        },
        onCloseForm: (state) => {
            state.visibleForm = false;
            state.userSelected = initialUserForm;
        },
        loadingError: (state, {payload}) => {
            state.errors = payload;
        }
    }
});

export const {
    ADD_USER,
    REMOVE_USER,
    UPDATE_USER,
    LOAD_USERS,
    onUserSelectedForm,
    onOpenForm,
    onCloseForm,
    loadingError,
} = usersSlice.actions;
        