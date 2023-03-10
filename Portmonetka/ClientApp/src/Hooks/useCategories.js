import { useState, useEffect } from "react";
import axios from 'axios';

const useCategories = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        getCategories();
    }, [])

    const getCategories = async () => {
        const url = "api/category";
        try {
            const result = await axios.get(url)
                .then((result) => {
                    setCategories(result.data)
                })
        } catch (error) {
            console.error(error);
        }
    }

    return categories;
}

export default useCategories;