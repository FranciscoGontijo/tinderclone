import api from "./api";

export type userType = {
    name: string;
    email: string;
    photoUrl: string;
    likedList: string[];
    _id: string;
}

export type LoginType = {
    token: string | null,
    user: userType | null
}

export const signUp = async (name: string, email: string, password: string): Promise<LoginType | null> => {
    let user: userType | null = null;
    let token: string | null = null;
    console.log(name, email, password);
    //use Axios to make the request
    await api.post('/createnewuser', {
        name: name,
        email: email,
        password: password
    })
        .then((response) => {
            user = response.data.user;
            token = response.data.token
        })
        .catch((error) => {
            console.log(error);
        });
    return {token, user};
};

export const logIn = async (email: string, password: string): Promise<LoginType | null> => {
    let token: string | null = null
    let user: userType | null = null
    await api.post('/login', { email: email, password: password })
        .then((response) => {
            token = response.data.accessToken;  
            user = response.data.user
        })
        .catch((error) => {
            console.log(error.message);
        });
    return {token, user};
};
