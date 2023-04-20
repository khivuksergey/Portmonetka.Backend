import { useState, useEffect } from "react";
import { IWallet } from "../DataTypes";
import axios, { AxiosError } from "axios";
import _ from "lodash";
import { mapKeys } from "lodash";

export default function useWallet() {
    const [wallets, setWallets] = useState<IWallet[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchWallets();
    }, [])

    const fetchWallets = async () => {
        const url = "api/wallet";
        try {
            setError("");
            if (!loading)
                setLoading(true);
            await axios.get<IWallet[]>(url)
                .then(response => {
                    const camelCasedData = response.data.map(item =>
                        mapKeys(item, (value, key) => _.camelCase(key))) as unknown as IWallet[];
                    setWallets(camelCasedData);
                    setLoading(false);
                });
        } catch (e: unknown) {
            setLoading(false);
            const error = e as AxiosError;
            setError(error.message);
            console.error(error);
        }
    }

    const handleGetWallets = async () => {
        fetchWallets();
    }

    const handleAddWallet = async (wallet: IWallet) => {
        const url = "api/wallet";
        try {
            setError("");
            setLoading(true);
            await axios.post<IWallet>(url, wallet)
                .then(() => {
                    fetchWallets();
                });
        } catch (e: unknown) {
            setLoading(false);
            const error = e as AxiosError;
            setError(error.message);
            console.error(error);
        }
    }

    const handleChangeWallet = async (changedWallet: IWallet) => {
        const url = `api/wallet/${changedWallet.id}`;
        try {
            setError("");
            setLoading(true);
            await axios.put<IWallet>(url, changedWallet)
                .then(() => {
                    fetchWallets();
                });
        } catch (e: unknown) {
            setLoading(false);
            const error = e as AxiosError;
            setError(error.message);
            console.error(error);
        }
    }

    const handleDeleteWallet = async (walletId: number, force: boolean = false) => {
        const url = `api/wallet/${walletId}?force=${force}`;
        try {
            setError("");
            setLoading(true);
            await axios.delete(url)
                .then((response) => {
                    console.log(response);
                    fetchWallets();
                    setLoading(false);
                })
        } catch (e: unknown) {
            setLoading(false);
            const error = e as AxiosError;
            setError(error.message);
            console.error(error);
        }
    }

    return { wallets, handleGetWallets, handleAddWallet, handleChangeWallet, handleDeleteWallet, loading, error };
}
