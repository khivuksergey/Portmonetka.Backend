import { useState, useEffect } from "react";
import { ITransaction } from "DataTypes";
import axios, { AxiosError } from "axios";
import _ from "lodash";
import { mapKeys } from "lodash";

export default function useTransaction (walletId: number) {
    const [transactions, setTransactions] = useState<ITransaction[]>([]);

    const [transactionsSum, setTransactionsSum] = useState(0);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    useEffect(() => {
        fetchTransactions();
    }, [])

    //useMemo for future
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
            if (!loading)
                setLoading(true);
            await axios.get<ITransaction[]>(url)
                .then(response => {
                    const camelCasedData = response.data.map(item =>
                        mapKeys(item, (value, key) => _.camelCase(key))) as unknown as ITransaction[];
                    setTransactions(camelCasedData);
                    setLoading(false);
                });
        } catch (e: unknown) {
            setLoading(false);
            const error = e as AxiosError;
            setError(error.message);
            console.error(error);
        }
    }

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

    const handleDeleteTransactions = async (ids: number[]) => {
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
            console.error(error);
        }
    }

    return { transactions, transactionsSum, handleAddTransactions, handleDeleteTransaction, handleDeleteTransactions, loading, error };
}
