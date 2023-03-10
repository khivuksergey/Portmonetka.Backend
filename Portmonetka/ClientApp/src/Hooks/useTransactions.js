import { useState, useEffect } from "react";
import axios from "axios";

const useTransactions = (wallet) => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        getTransactions();
    }, [wallet])

    const getTransactions = async () => {
        try {
            const result = await axios.get(`api/transaction/wallet/${wallet.Id}`)
                .then((result) => {
                    setTransactions(result.data);
                })
        } catch (error) {
            console.error(error);
        } /*finally {
            if (isFullMode) {
                getCategories();
            }
        }*/
    }

    const deleteTransaction = async (id) => {
        const url = `api/transaction/delete/id/${id}`;
        try {
            await axios.delete(url)
                .then(() => {
                    getTransactions();
                    //onDataChanged();
                })
        } catch (error) {
            console.error(error);
        }
    }

    return { transactions, deleteTransaction };
}

export default useTransactions;
