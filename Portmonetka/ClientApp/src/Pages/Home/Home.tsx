import { useState, useEffect } from "react";
import GlobalBalanceContext from "../../Context/GlobalBalanceContext";
import useWallet from "../../Hooks/useWallet";
import { IWallet, IGlobalBalance } from "../../DataTypes";
import Balance from "./Balance";
import AddWalletModal from "./AddWalletModal";
import WalletsAnimation from "../../walletsHover";
import BalancePlaceholder from "./BalancePlaceholder";
import WalletsPlaceholder from "./WalletsPlaceholder";
import ErrorAlert from "./ErrorAlert";
import AddFirstWallet from "./AddFirstWallet";
import Wallets from "./Wallets";

export default function Home() {

    // #region Initializations
    const {
        wallets/*: realWallets*/,
        refreshWallets,
        handleDeleteWallet,
        handleAddWallet,
        handleChangeWallet,
        dataFetched: walletsLoaded,
        error: walletsError
    } = useWallet();

    const [globalBalance, setGlobalBalance] = useState<IGlobalBalance[]>([]);

    //for testing
    //const [wallets, setWallets] = useState<IWallet[]>();

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

    const onDeleteWallet = async (id: number, force: boolean) => {
        const walletDeleted = handleDeleteWallet(id, force);
        walletDeleted.then((success) => {
            console.log("walletDeleted:", walletDeleted);
            console.log("success:", success);
            if (success) {
                console.log("refreshing wallets...");
                refreshWallets();

                setGlobalBalance((prev: any[]) => {
                    console.log(prev.filter(entry => entry.id !== id));
                    return prev.filter(entry => entry.id !== id);
                });
            }
        });
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

                    {/*<input type="text" placeholder="Search" className="form-control--dark searchbar"/>*/}

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
                        <AddFirstWallet onAddWallet={handleAddWalletModalShow}/>
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