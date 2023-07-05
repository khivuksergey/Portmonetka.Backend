import { useState, useEffect } from "react";
import { ICategory } from "../DataTypes";
import axios, { AxiosError, CancelTokenSource } from "axios";
import _ from "lodash";
import { mapKeys } from "lodash";

export default function useCategory() {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [dataFetched, setDataFetched] = useState<boolean>(false);
    let cancelTokenSource: CancelTokenSource | undefined;

    useEffect(() => {
        if (!dataFetched)
            fetchCategories();

        return () => {
            if (cancelTokenSource) {
                cancelTokenSource.cancel("Component unmounted");
            }
        }
    }, [dataFetched])

    const refreshCategories = () => {
        setDataFetched(false);
    }

    const fetchCategories = async () => {
        const url = "api/category";
        try {
            setError("");

            if (!loading) {
                setLoading(true);
            }

            cancelTokenSource = axios.CancelToken.source();

            await axios.get<ICategory[]>(url, { cancelToken: cancelTokenSource.token })
                .then(response => {
                    const camelCasedData = response.data.map(item =>
                        mapKeys(item, (value, key) => _.camelCase(key))) as unknown as ICategory[];
                    setCategories(camelCasedData);
                    setDataFetched(true);
                    //setLoading(false);
                });
        } catch (e: unknown) {
            //setLoading(false);
            if (axios.isCancel(e)) {
                //console.log("Request canceled: ", e.message);
            }
            const error = e as AxiosError;
            setError(error.message);
            //console.error(error);
        } finally {
            setLoading(false);
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
            //setLoading(false);
            const error = e as AxiosError;
            setError(error.message);
            console.error(error);
        } finally {
            setLoading(false);
        }

        return result ?? 0;
    }

    const handleChangeCategory = async (changedCategory: ICategory) => {
        const url = `api/category/${changedCategory.id}`;
        setError("");
        setLoading(true);

        return new Promise<boolean>((resolve, reject) => {
            axios.put(url, changedCategory)
                .then((response) => {
                    resolve(response.status <= 200 && response.status < 300);
                    //setLoading(false);
                })
                .catch((e: unknown) => {
                    //setLoading(false);
                    const error = e as AxiosError;
                    setError(error.message);
                    console.error(error);
                })
                .finally(() => {
                    setLoading(false);
                })
        })
    }

    const handleDeleteCategory = async (id: number, force: boolean = false): Promise<boolean> => {
        const url = `api/category/${id}&force=${force}`;//check
            setError("");
            setLoading(true);

        return new Promise<boolean>((resolve, reject) => {
            axios.delete(url)
                .then((response) => {
                    resolve(response.status <= 200 && response.status < 300);
                    console.log(response);
                    //fetchCategories();
                    //setLoading(false);
                })
                .catch((e: unknown) => {
                    //setLoading(false);
                    const error = e as AxiosError;
                    setError(error.message);
                    console.error(error);
                })
                .finally(() => {
                    setLoading(false);
                })
        })
    }

    return {
        categories,
        handleAddCategory,
        handleChangeCategory,
        handleDeleteCategory,
        refreshCategories,
        dataFetched,
        loading,
        error
    };
}