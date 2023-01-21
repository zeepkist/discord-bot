import axios from 'axios';
import { GITHUB_API_URL } from '../constants.js';
const api = axios.create({
    baseURL: `${GITHUB_API_URL}repos/wopian/zeepkist-bot/`,
    headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        'X-GitHub-Api-Version': '2022-11-28'
    }
});
export const getReleases = async () => {
    const response = await api.get('releases', {
        params: {
            per_page: 1
        }
    });
    if (response.status === 200)
        return response.data;
    else {
        throw response.data.error;
    }
};
