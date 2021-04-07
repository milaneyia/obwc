import Axios, { AxiosError } from 'axios';

const http = Axios.create();

http.interceptors.response.use((response) => response, (error: AxiosError) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    let message = 'Something went wrong!';

    if (error.response) {
        switch (error.response.status) {
            case 400:
                message = error.response.data.error || 'Invalid request';
                break;
            case 401:
                message = 'May need to log in first';
                break;
            case 403:
                message = 'Unauthorized';
                break;
        }

    } else {
        message = 'Something went really wrong';
    }

    alert(message);

    return Promise.reject(message);
});

export default http;
