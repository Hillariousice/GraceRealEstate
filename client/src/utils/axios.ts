import axios, { AxiosRequestConfig } from 'axios';

// Vite uses import.meta.env.VITE_... for environment variables
const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

interface ApiParams {
path?: string;
data?: any;
}

export const apiGet = ({ path }: ApiParams) => {
const config: AxiosRequestConfig = {
headers: {
Authorization:` Bearer ${localStorage.getItem('signature')}`,
},
};

return axios.get(`${baseUrl}/${path}`, config);
};

export const apiPost = ({ path, data }: ApiParams) => {
const config: AxiosRequestConfig = {
headers: {
Authorization:` Bearer ${localStorage.getItem('signature')}`,
},
};

return axios.post(`${baseUrl}/${path}`, data, config);
};

export const apiPut = ({ path, data }: ApiParams) => {
const config: AxiosRequestConfig = {
headers: {
Authorization: `Bearer ${localStorage.getItem('signature')}`,
},
};

return axios.put(`${baseUrl}/${path}`, data, config);
};

export const apiPatch = ({ path, data }: ApiParams) => {
const config: AxiosRequestConfig = {
headers: {
Authorization: `Bearer ${localStorage.getItem('signature')}`,
},
};

return axios.patch(`${baseUrl}/${path}`, data, config);
};

export const apiDelete = ({ path }: ApiParams) => {
const config: AxiosRequestConfig = {
headers: {
Authorization: `Bearer ${localStorage.getItem('signature')}`,
},
};

return axios.delete(`${baseUrl}/${path}`, config);
};