import { useState, useEffect } from "react";
import { IWallet } from "../Common/DataTypes";
import axios, { AxiosError, CancelTokenSource } from "axios";
import _, { mapKeys } from "lodash";

export default function useWallet() {
    const [wallets, setWallets] = useState<IWallet[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [dataFetched, setDataFetched] = useState(false);
    let cancelTokenSource: CancelTokenSource | undefined;

    useEffect(() => {
        if (!dataFetched)
            fetchWallets();

        return () => {
            if (cancelTokenSource) {
                cancelTokenSource.cancel("Component unmounted");
            }
        }
    }, [dataFetched])

    const refreshWallets = () => {
        setDataFetched(false);
    };

    const fetchWallets = async () => {
        const url = "api/wallet";
        try {
            setError("");

            if (!loading)
                setLoading(true);

            cancelTokenSource = axios.CancelToken.source();

            await axios.get<IWallet[]>(url, { cancelToken: cancelTokenSource.token })
                .then(response => {
                    const camelCasedData = response.data.map(item =>
                        mapKeys(item, (value, key) => _.camelCase(key))) as unknown as IWallet[];
                    setWallets(camelCasedData);
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
        }
    }

    const handleAddWallet = async (wallet: IWallet): Promise<boolean> => {
        const url = "api/wallet";
        setError("");
        setLoading(true);

        return new Promise<boolean>((resolve, reject) => {
            axios.post<IWallet>(url, wallet)
                .then((response) => {
                    resolve(response.status === 201);
                })
                .catch((e: unknown) => {
                    const error = e as AxiosError;
                    setError(error.response?.data as string);
                    console.error(error);
                })
                .finally(() => {
                    setLoading(false);
                })
        })
    }

    const handleChangeWallet = async (changedWallet: IWallet) => {
        const url = "api/wallet";
        setError("");
        setLoading(true);

        return new Promise<boolean>((resolve, reject) => {
            axios.post<IWallet>(url, changedWallet)
                .then((response) => {
                    resolve(response.status >= 200 && response.status < 300);
                })
                .catch((e: unknown) => {
                    const error = e as AxiosError;
                    setError(error.message);
                    console.error(error);
                })
                .finally(() => {
                    setLoading(false);
                })
        })
    }

    const handleDeleteWallet = async (walletId: number, force?: boolean): Promise<boolean> => {
        const url = `api/wallet/${walletId}` + (!!force ? `?force=${force}` : "");
        
        setError("");
        setLoading(true);

        try {
            const response = await axios.delete(url);

            if (response.data && response.data.ConfirmationRequired) {
                const confirmed = window.confirm("Are you sure you want to delete the wallet and all its transactions?");
                if (confirmed) {
                    return handleDeleteWallet(walletId, true);
                } else {
                    return false;
                }
            }

            return response.status >= 200 && response.status < 300;
        } catch (error: unknown) {
            setError((error as AxiosError).message);
            console.error(error);
            return false;
        } finally {
            setLoading(false);
        }
    }

    return {
        wallets,
        handleAddWallet,
        handleChangeWallet,
        handleDeleteWallet,
        refreshWallets,
        dataFetched,
        loading,
        error
    };
}
