import { useEffect, useState } from "react";
import { getFeaturedNews } from "../services/mockNewsApi";

export default function useFeatured(){
    const [featured , setFeatured] = useState([]);
    const [loading , setLoading] = useState(true);
    const [error , setError] = useState(null);

    useEffect(() => {
        async function loadFeatured() {
            try{
                const data = await getFeaturedNews();
                setFeatured(data);
            }catch (error) {
                console.error(error);
                setError('Não foi possível carregar ao destaque.');
            }finally {
                setLoading(false);
            }

        }

        loadFeatured()

    }, [])

    return { featured , loading , error }
}