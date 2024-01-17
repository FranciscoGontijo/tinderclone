import axios from "axios";
import { UserType } from "./auth";

const api = axios.create({
    baseURL: "http://192.168.1.115:5000/api",
});

export default api;

export type MessageType = {
    name: string,
    message: string,
    userId: string
}

//Chat screen http requests
export const fetchChatMessages = async (userId: string, controller: AbortController, token: string | null, setChat: React.Dispatch<React.SetStateAction<MessageType[]>>, setLoading: React.Dispatch<React.SetStateAction<Boolean>>) => {
    try {
        const response = await api.get(`/chat/${userId}`, {
            signal: controller.signal,
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        console.log('Fetching chat' + response.data);
        setChat(response.data);
        setLoading(false);
    } catch (error: any) {
        if (error.name === 'AbortError') {
            // Handle the cancellation error if needed
            console.log('Request canceled:', error.message);
        } else if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
            // Handle network errors or failed fetch request
            console.log('Network error:', error.message);
        } else {
            // Handle other API errors
            console.log('API error:', error.message);
        }
    }
};

export const updateChatAtDatabase = async (userId: string, controller: AbortController, token: string | null, updatedChat: MessageType[]) => {
    try {
        const response = await api.post(`/chatupdate/${userId}`, { chat: updatedChat }, {
            signal: controller.signal,
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        console.log(response.data); // Assuming you want to return something from the API call
    } catch (error: any) {
        if (error.name === 'AbortError') {
            // Handle the cancellation error if needed
            console.log('Request canceled:', error.message);
        } else if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
            // Handle network errors or failed fetch request
            console.log('Network error:', error.message);
        } else {
            // Handle other API errors
            console.log('API error:', error.message);
        }
    }
};

//Home screen http requests
export const fetchUserList = async (controller: AbortController, token: string | null, setUserList: React.Dispatch<React.SetStateAction<UserType[] | null>>, setLoading: React.Dispatch<React.SetStateAction<Boolean>>) => {
    try {
        const response = await api.get('/userlist', {
            signal: controller.signal,
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        setUserList(response.data);
        setLoading(false);
    } catch (error: any) {
        if (error.name === 'AbortError') {
            // Handle the cancellation error if needed
            console.log('Request canceled:', error.message);
        } else if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
            // Handle network errors or failed fetch request
            console.log('Network error:', error.message);
        } else {
            // Handle other API errors
            console.log('API error:', error.message);
        }
    }
};

export const likeUser = async (token: string | null, likedUserId: string) => {
    try {
        const response = await api.put(`/likeuser/${likedUserId}`, {}, {
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        });
    } catch (error: any) {
        if (error.name === 'AbortError') {
            // Handle the cancellation error if needed
            console.log('Request canceled:', error.message);
        } else if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
            // Handle network errors or failed fetch request
            console.log('Network error:', error.message);
        } else {
            // Handle other API errors
            console.log('API error:', error.message);
        }
    }
};

//Matched screen http requests
export type MatchedUserType = {
    name: string;
    photoUrl: string;
    _id: string,
    lastMessage: {
        message: string,
        sender: string
    }
};

export const fetchMatchedUsersList = async (controller: AbortController, token: string | null, setMatchedList: React.Dispatch<React.SetStateAction<MatchedUserType[] | null>>, setLoading: React.Dispatch<React.SetStateAction<Boolean>>) => {
    try {
        const response = await api.get('/matchedlist', {
            signal: controller.signal,
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        setMatchedList(response.data);
        setLoading(false);
    } catch (error: any) {
        if (error.name === 'AbortError') {
            // Handle the cancellation error if needed
            console.log('Request canceled:', error.message);
        } else if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
            // Handle network errors or failed fetch request
            console.log('Network error:', error.message);
        } else {
            // Handle other API errors
            console.log('API error:', error.message);
        }
    }
};