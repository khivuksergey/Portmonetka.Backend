import { useState, useEffect } from "react";
import GlobalBalanceContext from "../../Context/GlobalBalanceContext";
import useWallet from "../../Hooks/useWallet";
import { IWallet, IGlobalBalance } from "../../DataTypes";
import Balance from "./Balance";
import Wallet from "./Wallet";
import AddWalletModal from "./AddWalletModal";
import { FaWallet } from "react-icons/fa";
import { MdAdd } from "react-icons/md";
import WalletsAnimation from '../../walletsHover';

export default function Home() {
    const { wallets, handleGetWallets, handleDeleteWallet, handleAddWallet, handleChangeWallet } = useWallet();
    const [showAddWalletModal, setShowAddWalletModal] = useState(false);
    const [globalBalance, setGlobalBalance] = useState<IGlobalBalance[]>([]);

    useEffect(() => {
        WalletsAnimation();
    }, [])

    const handleAddWalletModalClose = () => setShowAddWalletModal(false);
    const handleAddWalletModalShow = () => setShowAddWalletModal(true);

    const onDeleteWallet = async (id: number, force: boolean) => {
        handleDeleteWallet(id, force);
        setGlobalBalance((prev: any[]) => {
            console.log(prev.filter(entry => entry.id !== id));
            return prev.filter(entry => entry.id !== id);
        });
    }

    const onAddWallet = async (wallet: IWallet) => {
        handleAddWallet(wallet);
    }

    const onGetWallets = async () => {
        handleGetWallets();
    }

    const onChangeWallet = async (wallet: IWallet) => {
        handleChangeWallet(wallet);
    }

    return (
        <GlobalBalanceContext.Provider value={{ globalBalance, setGlobalBalance }}>

            <Balance />

            <section>
                <div className="d-flex gap-3">
                    <h3>Wallets</h3>

                    <button className="add-wallet"
                        onClick={() => handleAddWalletModalShow()}>
                        {
                            wallets.length === 0 ?
                                <h1><MdAdd /> Add new wallet </h1>
                                : <><MdAdd /></>
                        }

                    </button>
                </div>
                

                <div id="wallets" className="mt-3">
                    {
                        wallets && wallets.length > 0 ?
                            wallets.map((wallet) => {
                                return <Wallet
                                    key={wallet.id}
                                    wallet={wallet}
                                    onGetWallets={onGetWallets}
                                    onDeleteWallet={onDeleteWallet}
                                    onChangeWallet={onChangeWallet} />
                            })
                            : null
                    }

                </div>
            </section>

            {showAddWalletModal ?
                <AddWalletModal
                    show={showAddWalletModal}
                    onClose={handleAddWalletModalClose}
                    onAddWallet={onAddWallet}
                />
                : null
            }
        </GlobalBalanceContext.Provider>
    )
}