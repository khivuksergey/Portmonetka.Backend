import { useState, useEffect } from "react";
import GlobalBalanceContext from "../../Context/GlobalBalanceContext";
import useWallet from "../../Hooks/useWallet";
import { IWallet, IGlobalBalance } from "../../DataTypes";
import Balance from "./Balance";
import Wallet from "./Wallet";
import AddWalletModal from "./AddWalletModal";
import { MdAdd } from "react-icons/md";
import WalletsAnimation from '../../walletsHover';

export default function Home() {
    const { wallets/*: realWallets*/, refreshWallets, handleDeleteWallet, handleAddWallet, handleChangeWallet, dataFetched: walletsLoaded } = useWallet();
    const [showAddWalletModal, setShowAddWalletModal] = useState(false);
    const [globalBalance, setGlobalBalance] = useState<IGlobalBalance[]>([]);

    //for testing
    //const [wallets, setWallets] = useState<IWallet[]>();

    useEffect(() => {
        if (walletsLoaded) {
            WalletsAnimation();
        }
    }, [walletsLoaded])

    const handleAddWalletModalClose = () => setShowAddWalletModal(false);

    const handleAddWalletModalShow = () => setShowAddWalletModal(true);

    const onDeleteWallet = async (id: number, force: boolean) => {
        handleDeleteWallet(id, force);
        refreshWallets();
        setGlobalBalance((prev: any[]) => {
            console.log(prev.filter(entry => entry.id !== id));
            return prev.filter(entry => entry.id !== id);
        });
    }

    const onAddWallet = async (wallet: IWallet) => {
        handleAddWallet(wallet);
        refreshWallets();
    }

    const onChangeWallet = async (wallet: IWallet) => {
        handleChangeWallet(wallet);
        refreshWallets();
    }

    return (
        <GlobalBalanceContext.Provider value={{ globalBalance, setGlobalBalance }}>
            {!walletsLoaded ?
                <div>Loading</div>
                :
                <>
                    {wallets && (wallets.length > 1) ?
                        <>
                            <Balance />

                            <section>
                                <div className="d-flex gap-3">
                                    <h3>Wallets</h3>

                                    <button className="add-wallet"
                                        onClick={() => handleAddWalletModalShow()}
                                    >
                                        <MdAdd />
                                    </button>
                                </div>


                                <div id="wallets" className="mt-3">
                                    {
                                        wallets && wallets.length > 0 ?
                                            wallets.map((wallet) => {
                                                return <Wallet
                                                    key={wallet.id}
                                                    wallet={wallet}
                                                    onDeleteWallet={onDeleteWallet}
                                                    onChangeWallet={onChangeWallet} />
                                            })
                                            : null
                                    }

                                </div>
                            </section>
                        </>
                        :
                        <div className="d-flex flex-column align-items-center mt-5">
                            <h1 style={{ textAlign: "center" }}>
                                Add your first wallet
                            </h1>

                            <button className="add-wallet add-wallet--big mt-2"
                                onClick={() => handleAddWalletModalShow()}
                            >
                                <MdAdd />
                            </button>
                        </div>
                    }


                </>
            }


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