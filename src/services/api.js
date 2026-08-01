import axios from "axios";

const api = axios.create({
    baseURL: "https://v3.football.api-sports.io/",

    headers: {
        "x-apisports-key": import.meta.env.VITE_API_KEY,
    }
})

export default api