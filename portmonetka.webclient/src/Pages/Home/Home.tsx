import { useState, useEffect } from "react";
import GlobalBalanceContext from "../../Context/GlobalBalanceContext";
import { useWallet } from "../../Hooks";
import { IWallet, IGlobalBalance } from "../../Common/DataTypes";
import { BalancePlaceholder, WalletsPlaceholder } from "./Placeholders";
import { AddFirstWallet, Balance, Wallets, WalletsAnimation } from "./";
import { AddWalletModal } from "./Modals";
import { ErrorAlert } from "../../Components";

export default function Home() {

    // #region Initializations
    const {
        wallets,
        refreshWallets,
        handleDeleteWallet,
        handleAddWallet,
        handleChangeWallet,
        dataFetched: walletsLoaded,
        error: walletsError
    } = useWallet();

    const [globalBalance, setGlobalBalance] = useState<IGlobalBalance[]>([]);

    // #endregion

    // #region UI functions

    const [showAddWalletModal, setShowAddWalletModal] = useState(false);

    const [showError, setShowError] = useState(false);

    useEffect(() => {
        setShowError(!!walletsError && walletsError !== "Component unmounted");
    }, [walletsError])

    useEffect(() => {
        if (walletsLoaded) {
            WalletsAnimation();
        }
    }, [walletsLoaded])

    const handleAddWalletModalClose = () => {
        setShowAddWalletModal(false);
    }

    const handleAddWalletModalShow = () => {
        setShowAddWalletModal(true);
    }

    // #endregion

    // #region Data change handlers

    const onAddWallet = async (wallet: IWallet) => {
        const walletAdded = handleAddWallet(wallet);
        walletAdded.then((success) => {
            if (success)
                refreshWallets();
        })
    }

    const onChangeWallet = async (wallet: IWallet) => {
        const walletChanged = handleChangeWallet(wallet);
        walletChanged.then((success) => {
            if (success)
                refreshWallets();
        })
    }

    const onDeleteWallet = async (id: number, force?: boolean): Promise<boolean> => {
        try {
            const success = await handleDeleteWallet(id, force);

            if (success) {
                refreshWallets();

                setGlobalBalance((prev: any[]) => {
                    return prev.filter(entry => entry.id !== id);
                });
            }

            return success;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    // #endregion

    return (
        <GlobalBalanceContext.Provider value={{ globalBalance, setGlobalBalance }}>
            {!walletsLoaded ?
                <>
                    <BalancePlaceholder />
                    <WalletsPlaceholder />
                </>
                :
                <>
                    <ErrorAlert showError={showError} onClose={() => setShowError(false)} error={walletsError} />

                    {wallets && (wallets.length > 1) ?
                        <>
                            <Balance />

                            <Wallets
                                wallets={wallets}
                                onAddWallet={handleAddWalletModalShow}
                                onDeleteWallet={onDeleteWallet}
                                onChangeWallet={onChangeWallet}
                            />
                        </>
                        :
                        <AddFirstWallet onAddWallet={handleAddWalletModalShow} />
                    }
                </>
            }

            <AddWalletModal
                show={showAddWalletModal}
                onClose={handleAddWalletModalClose}
                onAddWallet={onAddWallet}
            />

        </GlobalBalanceContext.Provider>
    )
}