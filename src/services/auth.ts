import api from "./api";
import axios from "axios";

export type UserType = {
    token: string;
    user: {
        name: string;
        email: string;
    }
};

type userType = {
    name: string;
    email: string;
}

type LogInType = {
    email: string;
    password: string;
}

export const signUp = (name: string, email: string, password: string): void => {
    let user: userType | null = null;
    console.log(name, email, password);
    //use Axios to make the request
    api.post('/createnewuser', {
        name: name,
        email: email,
        password: password
    })
        .then((response) => {
            let newUser = response.data;
            console.log(newUser);
        })
        .catch((error) => {
            if (error.response) {
                // The request was made and the server responded with a status code that falls out of the range of 2xx
                console.log("Response received, but with an error status:");
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                console.log("No response received from the server.");
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered the error
                console.log("Error setting up the request:", error.message);
            }
            console.log("Deu ruim - Network Error occurred");
            console.log(error);
        });

};

export const logIn = (email: String, password: String): void => {
    api.post('/login', { email: email, password: password })
        .then((response) => {
            console.log(response.data);
        })
        .catch((error) => {
            if (error.response) {
                // The request was made and the server responded with a status code that falls out of the range of 2xx
                console.log("Response received, but with an error status:");
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                console.log("No response received from the server.");
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered the error
                console.log("Error setting up the request:", error.message);
            }
            console.log("Deu ruim - Network Error occurred");
            console.log(error);
        });
}

// use here for the sigin or use the provider

//Test api request with a simple get request
//So far is not working
export const testAPI = async (): Promise<void> => {
    api.get('/').then((response) => {
        console.log(response.data)
    }).catch((error) => {
        if (error.response) {
            // The request was made and the server responded with a status code that falls out of the range of 2xx
            console.log("Response received, but with an error status:");
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            console.log("No response received from the server.");
            console.log(error.request);
        } else {
            // Something happened in setting up the request that triggered the error
            console.log("Error setting up the request:", error.message);
        }
        console.log("Deu ruim - Network Error occurred");
        console.log(error);
    })
};

