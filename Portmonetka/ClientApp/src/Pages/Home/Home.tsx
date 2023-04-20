import { useState } from "react";
import GlobalBalanceContext from "../../Context/GlobalBalanceContext";
import useWallet from "../../Hooks/useWallet";
import { IWallet, IGlobalBalance } from "../../DataTypes";
import Balance from "./Balance";
import Wallet from "./Wallet";
import AddWalletModal from "./AddWalletModal";
import { Container } from "react-bootstrap";
import { FaWallet } from "react-icons/fa";

export default function Home() {
    const { wallets, handleGetWallets, handleDeleteWallet, handleAddWallet, handleChangeWallet } = useWallet();
    const [showAddWalletModal, setShowAddWalletModal] = useState(false);
    const [globalBalance, setGlobalBalance] = useState<IGlobalBalance[]>([]);

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

            <section className="wallets mt-4">
                <Container>
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

                </Container>

            </section>

            <div className="container d-grid my-4">
                <button className="btn btn-dark add-wallet"
                    onClick={() => handleAddWalletModalShow()}>
                    {
                        wallets.length === 0 ?
                            <h1><FaWallet /> Add new wallet </h1>
                            : <FaWallet />
                    }

                </button>
            </div>

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