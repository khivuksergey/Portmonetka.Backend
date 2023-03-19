import { useState, useEffect } from 'react';
import axios from 'axios';

const useWallets = () => {
    const [wallets, setWallets] = useState([]);

    useEffect(() => {
        getWallets();
    }, [])

    const getWallets = async () => {
        const url = "api/wallet";
        try {
            const result = await axios.get(url)
                .then((result) => {
                    setWallets(result.data);
                })
        } catch (error) {
            console.error(error);
        }
    }

    const handleDeleteWallet = async (walletId) => {
        deleteTransactionsByWallet(walletId);
    }

    const deleteTransactionsByWallet = async (walletId) => {
        const url = `api/transaction/delete/wallet/${walletId}`;
        try {
            await axios.delete(url)
                .then(() => deleteWallet(walletId))
        } catch (error) {
            console.error(error);
        }
    }

    const deleteWallet = async (walletId) => {
        const url = `api/wallet/${walletId}`;
        try {
            await axios.delete(url)
                .then(() => {
                    getWallets();
                })
        } catch (error) {
            console.error(error);
        }
    }

    const handleAddWallet = async (wallet) => {
        const url = "api/wallet";
        const data = {
            "name": wallet.name,
            "currency": wallet.currency.toUpperCase(),
            "initialAmount": wallet.initialAmount,
            "iconFileName": wallet.iconFileName
        };

        try {
            await axios.post(url, data)
                .then(() => {
                    getWallets();
                });
        } catch (error) {
            console.error(error);
        }
    }

    return { wallets, getWallets, handleDeleteWallet, handleAddWallet };
}

export default useWallets;
