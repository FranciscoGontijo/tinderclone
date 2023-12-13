import api from "./api";

type userType = {
    name: string;
    email: string;
    likedList: string[];
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


export const logIn = (email: string, password: string): userType | null => {
    let user: userType | null = null
    api.post('/login', { email: email, password: password })
        .then((response) => {
            user = response.data
        })
        .catch((error) => {
            console.log(error.message);
        });
    return user;
}

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

