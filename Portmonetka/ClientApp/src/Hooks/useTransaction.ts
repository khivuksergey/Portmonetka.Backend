import { useState, useEffect } from "react";
import { ITransaction } from "DataTypes";
import axios, { AxiosError, CancelTokenSource } from "axios";
import _ from "lodash";
import { mapKeys } from "lodash";

export default function useTransaction(walletId: number, latestCount?: number) {
    const [transactions, setTransactions] = useState<ITransaction[]>([]);
    const [transactionsSum, setTransactionsSum] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [dataFetched, setDataFetched] = useState(false);
    let cancelTokenSource: CancelTokenSource | undefined;

    useEffect(() => {
        if (!dataFetched) {
            if (!!latestCount) {
                fetchTransactionsLatest(latestCount);
            } else {
                fetchTransactions();
            }
        }

        return () => {
            if (cancelTokenSource) {
                cancelTokenSource.cancel("Component unmounted");
            }
        }
    }, [dataFetched])

    //replace with backend service
    useEffect(() => {
        calcTransactionsSum();
    }, [transactions])

    const calcTransactionsSum = () => {
        let transactionsSum = transactions.reduce((sum, val) => sum + val.amount, 0);
        setTransactionsSum(transactionsSum);
    }

    const fetchTransactions = async () => {
        const url = `api/transaction/wallet/${walletId}`;
        try {
            setError("");

            if (!loading) {
                setLoading(true);
            }

            cancelTokenSource = axios.CancelToken.source();

            await axios.get<ITransaction[]>(url, { cancelToken: cancelTokenSource.token })
                .then(response => {
                    const camelCasedData = response.data.map(item =>
                        mapKeys(item, (value, key) => _.camelCase(key))) as unknown as ITransaction[];
                    setTransactions(camelCasedData);
                    setDataFetched(true);
                    setLoading(false);
                });
        } catch (e: unknown) {
            setLoading(false);
            if (axios.isCancel(e)) {
                //console.log("Request canceled: ", e.message);
            }
            const error = e as AxiosError;
            setError(error.message);
            //console.error(error);
        }
    }

    const fetchTransactionsLatest = async (count: number) => {
        const url = `api/transaction/wallet/${walletId}/latest/${count}`;
        try {
            setError("");

            if (!loading) {
                setLoading(true);
            }

            cancelTokenSource = axios.CancelToken.source();

            await axios.get<ITransaction[]>(url, { cancelToken: cancelTokenSource.token })
                .then(response => {
                    const camelCasedData = response.data.map(item =>
                        mapKeys(item, (value, key) => _.camelCase(key))) as unknown as ITransaction[];
                    setTransactions(camelCasedData);
                    setDataFetched(true);
                    setLoading(false);
                });
        } catch (e: unknown) {
            setLoading(false);
            if (axios.isCancel(e)) {
                //console.log("Request canceled: ", e.message);
            }
            const error = e as AxiosError;
            setError(error.message);
            //console.error(error);
        }
    }

    const refreshTransactions = () => {
        setDataFetched(false);
    };

    const handleAddTransactions = async (transactions: ITransaction[]) => {
        const url = "api/transaction";
        try {
            setError("");
            setLoading(true);
            await axios.post(url, transactions)
                .then(() => {
                    fetchTransactions();
                    setLoading(false);
                });
        } catch (e: unknown) {
            setLoading(false);
            const error = e as AxiosError;
            setError(error.message);
            console.error(error);
        }
    }

    const handleDeleteTransaction = async (id: number) => {
        const url = `api/transaction/delete/id/${id}`;
        try {
            setError("");
            setLoading(true);
            await axios.delete(url)
                .then(() => {
                    fetchTransactions();
                    setLoading(false);
                })
        } catch (e: unknown) {
            setLoading(false);
            const error = e as AxiosError;
            setError(error.message);
            console.error(error);
        }
    }

    const handleDeleteMultipleTransactions = async (ids: number[]) => {
        const url = `api/transaction/delete`;
        try {
            setError("");
            setLoading(true);
            await axios.delete(url, { data: ids })
                .then(() => {
                    fetchTransactions();
                    setLoading(false);
                })
        } catch (e: unknown) {
            setLoading(false);
            const error = e as AxiosError;
            setError(error.message);
            //console.error(error);
        }
    }

    return {
        transactions,
        transactionsSum,
        handleAddTransactions,
        handleDeleteTransaction,
        handleDeleteMultipleTransactions,
        refreshTransactions,
        dataFetched,
        loading,
        error
    };
}
