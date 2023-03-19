import { useState } from "react";
import useWallets from "../../Hooks/useWallets";
import GlobalBalanceContext from "../../Context/GlobalBalanceContext";
import Container from "react-bootstrap/Container";
import Balance from "./Balance";
import Wallet from "./Wallet";
import AddWalletModal from "./AddWalletModal";
import { FaWallet } from "react-icons/fa";

function Home() {
    const { wallets, getWallets, handleDeleteWallet, handleAddWallet } = useWallets();
    const [showAddWalletModal, setShowAddWalletModal] = useState(false);
    const [walletsBalance, setWalletsBalance] = useState([]);

    const handleAddWalletModalClose = () => setShowAddWalletModal(false);
    const handleAddWalletModalShow = () => setShowAddWalletModal(true);

    const onDeleteWallet = (id) => {
        handleDeleteWallet(id);
        setWalletsBalance((prev) => {
            console.log(prev.filter(entry => entry.id !== id));
            return prev.filter(entry => entry.id !== id);
        });
    }

    const addWallet = (wallet) => {
        handleAddWallet(wallet);
        //const newBalance = {
        //    id: wallet.Id,
        //    currency: wallet.Currency,
        //    amount: Number(wallet.InitialAmount) + Number(transactionsSum)
        //};
        //setWalletsBalance((prev) => {
        //    return prev.push(newBalance);
        //});
    }

    const onGetWallets = async () => {
        getWallets();
    }

    return (
        <GlobalBalanceContext.Provider value={{ walletsBalance, setWalletsBalance }}>

            <Balance />

            <section className="wallets mt-4">
                <Container>
                    {
                        wallets && wallets.length > 0 ?
                            wallets.map((wallet) =>
                                <Wallet
                                    key={wallet.Id}
                                    wallet={wallet}
                                    onDeleteWallet={onDeleteWallet}
                                    onGetWallets={onGetWallets}/>)
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

            {showAddWalletModal &&
                <AddWalletModal
                    open={showAddWalletModal}
                    onClose={handleAddWalletModalClose}
                    handleAddWallet={addWallet}
                />
            }
        </GlobalBalanceContext.Provider>
    )
}

export default Home;