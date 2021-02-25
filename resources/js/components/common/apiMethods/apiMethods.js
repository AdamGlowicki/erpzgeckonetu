import axios from 'axios';

axios.defaults.baseURL = '/api';

export const getData = (url = '', cookies) => {
    return (axios.get(url, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${cookies.apiToken}`,
        }
    }))
};

export const getFile = (url = '', cookies) => {
    return (axios.get(url, {
        responseType: 'blob',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${cookies.apiToken}`,
        }
    }))
};

export const postData = (url = '', data = {}, cookies) => {
    return (axios.post(url, {...data}, {headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${cookies.apiToken}`,
        }}))
};

export const postFile = (url = '', data = {}, cookies) => {
    return (axios.post(url, data, {headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${cookies.apiToken}`,
        }}))
};

export const putByFormData = (url = '', data = {}, cookies) => {
    return (axios.put(url, data, {headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${cookies.apiToken}`,
        }}))
};

export const putData = (url = '', data = {}, cookies) => {
    return (axios.put(url, data, {headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${cookies.apiToken}`,
        }}))
};

export const patchData = (url = '', data = {}, cookies) => {
    return (axios.patch(url, {...data}, {headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${cookies.apiToken}`,
        }}))
};

export const deleteData = (url  = '', cookies) => {
    return (axios.delete(url, {headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${cookies.apiToken}`,
        }}))
};
export const deleteDataByIds = (url  = '', cookies, ids) => {
    return (axios.delete(url, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${cookies.apiToken}`,
        },
        params: {ids}
    }))
};

const cancelToken = axios.CancelToken;
const source = cancelToken.source();

export const cancelPostData = (url, data, cookies) => {
    return (axios.post(url, {...data},{
        cancelToken: source.token,
    }))
}

export const handleErrorApi = (fn, callback) => (...params) => fn(...params).catch(err => {
    callback(err)
})

export const handleErrorFileUpload = (fn, callback) => (...params) => fn(...params).catch(err => {
    callback(err)
})

