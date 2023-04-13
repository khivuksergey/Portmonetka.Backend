import { useState, useEffect } from "react";
import { ITransaction } from "DataTypes";
import axios, { AxiosError } from "axios";

export default function useTransaction (walletId: number) {
    const [transactions, setTransactions] = useState<ITransaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchTransactions();
    }, [])

    const fetchTransactions = async () => {
        const url = `api/transaction/wallet/${walletId}`;
        try {
            setError("");
            if (!loading)
                setLoading(true);
            await axios.get<ITransaction[]>(url)
                .then(response => {
                    setTransactions(response.data);
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
            await axios.post<ITransaction[]>(url, transactions)
                .then(() => {
                    fetchTransactions();
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

    return { transactions, handleAddTransactions, handleDeleteTransaction, loading, error };
}
