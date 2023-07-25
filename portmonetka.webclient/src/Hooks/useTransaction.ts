import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../Context/AuthContext";
import { ITransaction } from "../Common/DataTypes";
import { ReadFromLocalStorage, WriteToLocalStorage } from "../Utilities";
import axios, { AxiosError, CancelTokenSource } from "axios";
import _, { mapKeys } from "lodash";

export default function useTransaction(walletId: number, latestCount?: number) {
    const { token, userId } = useContext(AuthContext);
    const [transactions, setTransactions] = useState<ITransaction[]>([]);
    const [transactionsSum, setTransactionsSum] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [dataFetched, setDataFetched] = useState(false);
    let cancelTokenSource: CancelTokenSource | undefined;

    useEffect(() => {
        if (!dataFetched) {
            if (!!latestCount) {
                const dataLatest = ReadFromLocalStorage(`transactionsLatest_${walletId}`) as ITransaction[];
                if (dataLatest) {
                    setTransactions(dataLatest);
                    setDataFetched(true);
                } else {
                    fetchTransactionsLatest(latestCount);
                }
            } else {
                const data = ReadFromLocalStorage(`transactions_${walletId}`) as ITransaction[];
                if (data) {
                    setTransactions(data);
                    setDataFetched(true);
                } else {
                    fetchTransactions();
                }
            }
        }
        return () => {
            if (cancelTokenSource) {
                cancelTokenSource.cancel("Component unmounted");
            }
        }
    }, [dataFetched, latestCount])

    //replace with backend service
    useEffect(() => {
        calcTransactionsSum();
    }, [transactions])

    const calcTransactionsSum = () => {
        let transactionsSum = transactions.reduce((sum, val) => sum + val.amount, 0);
        setTransactionsSum(transactionsSum);
    }

    const refreshTransactions = () => {
        setDataFetched(false);
    };

    const fetchTransactions = async () => {
        const url = `api/transaction/wallet/${walletId}`;
        try {
            setError("");

            if (!loading) {
                setLoading(true);
            }

            cancelTokenSource = axios.CancelToken.source();

            await axios.get<ITransaction[]>(url, {
                cancelToken: cancelTokenSource.token,
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => {
                    const camelCasedData = response.data.map(item =>
                        mapKeys(item, (value, key) => _.camelCase(key))) as unknown as ITransaction[];
                    setTransactions(camelCasedData);
                    setDataFetched(true);

                    WriteToLocalStorage(`transactions_${walletId}`, camelCasedData);
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

    const fetchTransactionsLatest = async (count: number) => {
        const url = `api/transaction/wallet/${walletId}?latest=${count}`;
        try {
            setError("");

            if (!loading) {
                setLoading(true);
            }

            cancelTokenSource = axios.CancelToken.source();
            await axios.get<ITransaction[]>(url, {
                cancelToken: cancelTokenSource.token,
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => {
                    const camelCasedData = response.data.map(item =>
                        mapKeys(item, (value, key) => _.camelCase(key))) as unknown as ITransaction[];
                    setTransactions(camelCasedData);
                    setDataFetched(true);

                    WriteToLocalStorage(`transactionsLatest_${walletId}`, camelCasedData);
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

    const handleAddTransactions = async (transactions: ITransaction[]): Promise<boolean> => {
        const url = "api/transaction";
        setError("");
        setLoading(true);

        const transactionsWithUserId = transactions.map(transaction => {
            return { ...transaction, userId: userId }
        })

        return new Promise<boolean>((resolve, reject) => {
            axios.post(
                url,
                transactionsWithUserId,
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

    const handleChangeTransactions = async (transactions: ITransaction[]): Promise<boolean> => {
        const url = `api/transaction/`;
        setError("");
        setLoading(true);

        const transactionsWithUserId = transactions.map(transaction => {
            return { ...transaction, userId: userId }
        })

        return new Promise<boolean>((resolve, reject) => {
            axios.post(
                url,
                transactionsWithUserId,
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

    const handleDeleteTransactions = async (ids: number[]): Promise<boolean> => {
        const url = `api/transaction/`;
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
        transactions,
        transactionsSum,
        handleAddTransactions,
        handleChangeTransactions,
        handleDeleteTransactions,
        refreshTransactions,
        dataFetched,
        loading,
        error
    };
}
