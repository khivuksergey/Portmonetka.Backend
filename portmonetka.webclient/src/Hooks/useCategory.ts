import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../Context/AuthContext";
import { ICategory } from "../Common/DataTypes";
import axios, { AxiosError, CancelTokenSource } from "axios";
import _ from "lodash";
import { mapKeys } from "lodash";
import { ClearLocalStorage, ReadFromLocalStorage, WriteToLocalStorage } from "../Utilities";

export default function useCategory(sorted?: boolean) {
    const { token, userId } = useContext(AuthContext);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [dataFetched, setDataFetched] = useState(false);
    const [categoriesExist, setCategoriesExist] = useState(false);
    let cancelTokenSource: CancelTokenSource | undefined;

    useEffect(() => {
        if (!dataFetched) {
            const data = ReadFromLocalStorage(`categories_${userId}`) as ICategory[];
            if (data) {
                setCategories(data);
                setDataFetched(true);
            } else {
                fetchCategories(sorted);
            }
        }

        return () => {
            if (cancelTokenSource) {
                cancelTokenSource.cancel("Component unmounted");
            }
        }
    }, [dataFetched])

    useEffect(() => {
        setCategoriesExist(categories.length > 0 && !error.includes("No categories were found"));
    }, [categories, error])

    const refreshCategories = () => {
        ClearLocalStorage(`categories_${userId}`);
        setDataFetched(false);
    }

    const fetchCategories = async (sorted? : boolean) => {
        const url = `api/category${sorted ? "?sorted=true" : ""}`;
        try {
            setError("");

            if (!loading) {
                setLoading(true);
            }

            cancelTokenSource = axios.CancelToken.source();

            await axios.get<ICategory[]>(url, {
                cancelToken: cancelTokenSource.token,
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => {
                    const camelCasedData = response.data.map(item =>
                        mapKeys(item, (value, key) => _.camelCase(key))) as unknown as ICategory[];
                    setCategories(camelCasedData);
                    setDataFetched(true);

                    WriteToLocalStorage(`categories_${userId}`, camelCasedData);
                });
        } catch (e: unknown) {
            if (axios.isCancel(e)) {
                //console.log("Request canceled: ", e.message);
            }
            const error = e as AxiosError;
            setError(error.response?.data?.toString() ?? error.message);
        } finally {
            setLoading(false);
        }
    }

    const handleAddCategory = async (category: ICategory): Promise<number> => {
        let result = 0;
        const url = "api/category/";
        try {
            setError("");
            setLoading(true);
            await axios.post(
                url,
                { ...category, userId: userId },
                { headers: { Authorization: `Bearer ${token}` } }
            )
                .then(response => {
                    fetchCategories();
                    result = response.data.Id;
                });
        } catch (e: unknown) {
            const error = e as AxiosError;
            setError(error.response?.data?.toString() ?? error.message);
        } finally {
            setLoading(false);
        }

        return result ?? 0;
    }

    const handleChangeCategory = async (changedCategory: ICategory) => {
        const url = "api/category/update";
        setError("");
        setLoading(true);

        return new Promise<boolean>((resolve, reject) => {
            axios.put(
                url,
                { ...changedCategory, userId: userId },
                { headers: { Authorization: `Bearer ${token}` } }
            )
                .then((response) => {
                    resolve(response.status >= 200 && response.status < 300);
                })
                .catch((e: unknown) => {
                    const error = e as AxiosError;
                    setError(error.response?.data?.toString() ?? error.message);
                })
                .finally(() => {
                    setLoading(false);
                })
        })
    }

    const handleDeleteCategory = async (id: number, force?: boolean): Promise<boolean> => {
        const url = `api/category/${id}` + (!!force ? `?force=${force}` : "");
        setError("");
        setLoading(true);

        return new Promise<boolean>((resolve, reject) => {
            axios.delete(url, { headers: { Authorization: `Bearer ${token}` } })
                .then((response) => {
                    resolve(response.status >= 200 && response.status < 300);
                })
                .catch((e: unknown) => {
                    const error = e as AxiosError;
                    setError(error.response?.data?.toString() ?? error.message);
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
        categoriesExist,
        dataFetched,
        loading,
        error
    };
}