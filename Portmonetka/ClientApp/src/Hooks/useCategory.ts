import { useState, useEffect } from "react";
import { ICategory } from "../DataTypes";
import axios, { AxiosError } from "axios";
import _ from "lodash";
import { mapKeys } from "lodash";

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
                    const camelCasedData = response.data.map(item =>
                        mapKeys(item, (value, key) => _.camelCase(key))) as unknown as ICategory[];
                    setCategories(camelCasedData);
                    setLoading(false);
                });
        } catch (e: unknown) {
            setLoading(false);
            const error = e as AxiosError;
            setError(error.message);
            console.error(error);
        }
    }

    const handleAddCategory = async (category: ICategory): Promise<number> => {
        let result = 0;
        const url = "api/category";
        try {
            setError("");
            setLoading(true);
            await axios.post(url, category)
                .then(response => {
                    fetchCategories();
                    result = response.data.Id;
                });
        } catch (e: unknown) {
            setLoading(false);
            const error = e as AxiosError;
            setError(error.message);
            console.error(error);
        }
        return result ?? 0;
    }

    const handleChangeCategory = async (changedCategory: ICategory) => {
        const url = `api/category/${changedCategory.id}`;
        try {
            setError("");
            setLoading(true);
            await axios.put(url, changedCategory)
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