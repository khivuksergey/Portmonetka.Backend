import { useState, useEffect } from "react";
import { ICategory } from "../DataTypes";
import axios, { AxiosError } from "axios";

export default function useCategory() {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchCategories();
    }, [])

    const fetchCategories = async () => {
        const url = "api/category";
        try {
            setError("");
            if (!loading)
                setLoading(true);
            await axios.get<ICategory[]>(url)
                .then(response => {
                    setCategories(response.data);
                    setLoading(false);
                });
        } catch (e: unknown) {
            setLoading(false);
            const error = e as AxiosError;
            setError(error.message);
            console.error(error);
        }
    }

    const handleAddCategory = async (category: ICategory): Promise<number | undefined> => {
        const url = "api/category";
        try {
            setError("");
            setLoading(true);
            await axios.post<ICategory>(url, category)
                .then(response => {
                    fetchCategories();
                    return response.data.id;
                });
        } catch (e: unknown) {
            setLoading(false);
            const error = e as AxiosError;
            setError(error.message);
            console.error(error);
        }
        return undefined;
    }

    const handleChangeCategory = async (changedCategory: ICategory) => {
        const url = `api/category/${changedCategory.id}`;
        try {
            setError("");
            setLoading(true);
            await axios.put<ICategory>(url, changedCategory)
                .then(() => {
                    fetchCategories();
                });
        } catch (e: unknown) {
            setLoading(false);
            const error = e as AxiosError;
            setError(error.message);
            console.error(error);
        }
    }

    const handleDeleteCategory = async (id: number, force: boolean = false) => {
        const url = `api/category/${id}&force=${force}`;//check
        try {
            setError("");
            setLoading(true);
            await axios.delete(url)
                .then((response) => {
                    console.log(response);
                    fetchCategories();
                    setLoading(false);
                })
        } catch (e: unknown) {
            setLoading(false);
            const error = e as AxiosError;
            setError(error.message);
            console.error(error);
        }
    }

    return { categories, handleAddCategory, handleChangeCategory, handleDeleteCategory, loading, error };
}