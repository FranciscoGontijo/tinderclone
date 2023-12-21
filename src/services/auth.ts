import api from "./api";

export type userType = {
    name: string;
    email: string;
    photoUrl: string;
    likedList: string[];
    _id: string;
}


export const signUp = async (name: string, email: string, password: string): Promise<userType | null> => {
    let user: userType | null = null;
    console.log(name, email, password);
    //use Axios to make the request
    await api.post('/createnewuser', {
        name: name,
        email: email,
        password: password
    })
        .then((response) => {
            user = response.data;
        })
        .catch((error) => {
            console.log(error);
        });
    return user;
};

type LoginType = {
    token: string | null,
    user: userType | null
}
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

// use here for the sigin or use the provider

//Test api request with a simple get request


//Error handling and testing API
// export const testAPI = (): void => {
//     api.get('/').then((response) => {
//         console.log(response.data)
//     }).catch((error) => {
//         if (error.response) {
//             // The request was made and the server responded with a status code that falls out of the range of 2xx
//             console.log("Response received, but with an error status:");
//             console.log(error.response.data);
//             console.log(error.response.status);
//             console.log(error.response.headers);
//         } else if (error.request) {
//             // The request was made but no response was received
//             console.log("No response received from the server.");
//             console.log(error.request);
//         } else {
//             // Something happened in setting up the request that triggered the error
//             console.log("Error setting up the request:", error.message);
//         }
//         console.log("Deu ruim - Network Error occurred");
//         console.log(error);
//     })
// };

