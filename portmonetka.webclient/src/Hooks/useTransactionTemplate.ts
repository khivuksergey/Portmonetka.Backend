import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../Context/AuthContext";
import { ITransactionTemplate } from "../Common/DataTypes";
import { ReadFromLocalStorage, WriteToLocalStorage } from "../Utilities";
import axios, { AxiosError, CancelTokenSource } from "axios";
import _, { mapKeys } from "lodash";

export default function useTransactionTemplate() {
    const { token, userId } = useContext(AuthContext);
    const [templates, setTemplates] = useState<ITransactionTemplate[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [dataFetched, setDataFetched] = useState(false);
    let cancelTokenSource: CancelTokenSource | undefined;

    useEffect(() => {
        if (!dataFetched) {
            const data = ReadFromLocalStorage(`transactionTemplates_${userId}`) as ITransactionTemplate[];
            if (data) {
                setTemplates(data);
                setDataFetched(true);
            } else {
                fetchTemplates();
            }
        }

        return () => {
            if (cancelTokenSource) {
                cancelTokenSource.cancel("Component unmounted");
            }
        }
    }, [dataFetched])

    const refreshTemplates = () => {
        setDataFetched(false);
    };

    const fetchTemplates = async () => {
        const url = "api/transactionTemplate/";
        try {
            setError("");

            if (!loading) {
                setLoading(true);
            }

            cancelTokenSource = axios.CancelToken.source();

            await axios.get<ITransactionTemplate[]>(url, {
                cancelToken: cancelTokenSource.token,
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => {
                    const camelCasedData = response.data.map(item =>
                        mapKeys(item, (value, key) => _.camelCase(key))) as unknown as ITransactionTemplate[];
                    setTemplates(camelCasedData);
                    setDataFetched(true);

                    WriteToLocalStorage(`transactionTemplates_${userId}`, camelCasedData);
                });
        } catch (e: unknown) {
            if (axios.isCancel(e)) {
                //console.log("Request canceled: ", e.message);
            }
            const error = e as AxiosError;
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    const handleAddTemplates = async (templates: ITransactionTemplate[]): Promise<boolean> => {
        const url = "api/transactionTemplate";
        setError("");
        setLoading(true);

        const templatesWithUserId = templates.map(template => {
            return { ...template, userId: userId }
        })

        return new Promise<boolean>((resolve, reject) => {
            axios.post(
                url,
                templatesWithUserId,
                { headers: { Authorization: `Bearer ${token}` } }
            )
                .then((response) => {
                    resolve(response.status === 201);
                })
                .catch((e: unknown) => {
                    const error = e as AxiosError;
                    setError(error.message);
                    console.error(error);
                })
                .finally(() => {
                    setLoading(false);
                });
        })
    }

    const handleChangeTemplates = async (templates: ITransactionTemplate[]): Promise<boolean> => {
        const url = "api/transactionTemplate";
        setError("");
        setLoading(true);

        const templatesWithUserId = templates.map(template => {
            return { ...template, userId: userId }
        })

        return new Promise<boolean>((resolve, reject) => {
            axios.post(
                url,
                templatesWithUserId,
                { headers: { Authorization: `Bearer ${token}` } }
            )
                .then((response) => {
                    resolve(response.status >= 200 && response.status < 300);
                })
                .catch((e: unknown) => {
                    const error = e as AxiosError;
                    setError(error.message);
                    //console.error(error);
                })
                .finally(() => {
                    setLoading(false);
                })
        })
    }

    const handleDeleteTemplates = async (ids: number[]): Promise<boolean> => {
        const url = "api/transactionTemplate/";
        setError("");
        setLoading(true);

        return new Promise<boolean>((resolve, reject) => {
            axios.delete(url, {
                data: ids,
                headers: { Authorization: `Bearer ${token}` }
            })
                .then((response) => {
                    resolve(response.status >= 200 && response.status < 300);
                })
                .catch((e: unknown) => {
                    const error = e as AxiosError;
                    setError(error.message);
                })
                .finally(() => {
                    setLoading(false);
                })
        })
    }

    return {
        templates,
        handleAddTemplates,
        handleChangeTemplates,
        handleDeleteTemplates,
        refreshTemplates,
        dataFetched,
        loading,
        error
    };
}
