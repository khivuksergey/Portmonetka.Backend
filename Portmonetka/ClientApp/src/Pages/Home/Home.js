import { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Balance from "./Balance";
import Wallet from "./Wallet";
import AddWalletModal from "./AddWalletModal";
import { FaWallet } from 'react-icons/fa';


function Home() {
    const [wallets, setWallets] = useState([])
    const [showAddWalletModal, setShowAddWalletModal] = useState(false);

    const [globalBalance, setGlobalBalance] = useState([])

    useEffect(() => {
        getWallets();
    }, [])

    const handleAddWalletModalClose = () => setShowAddWalletModal(false);
    const handleAddWalletModalShow = () => setShowAddWalletModal(true);

    const onDataChanged = () => {
        getWallets();
    }

    const getWallets = async () => {
        const url = "api/wallet";
        try {
            const result = await axios.get(url)
                .then((result) => {
                    setWallets(result.data);
                    console.log('asdasd', result.data);
                })
        } catch (error) {
            console.error(error);
        }
    }

    const getWalletBalance = (balance) => {
        setGlobalBalance(globalBalance => {
            if (globalBalance.length >= wallets.length) {
                globalBalance.splice(0, globalBalance.length - wallets.length + 1);
            }
            return [...globalBalance, { currency: balance.currency, amount: balance.amount }]
        });
    }

    const addNewWalletBalance = (balance) => {
        setGlobalBalance([...globalBalance, { currency: balance.currency, amount: balance.amount }]);
    }

    return (
        <>

            <Balance globalBalance={globalBalance} />

            <section className="wallets mt-4">
                <Container>
                    {
                        wallets && wallets.length > 0 ?
                            wallets.map((item) =>
                                <Wallet key={item.Id} wallet={item} onDataChanged={onDataChanged} getWalletBalance={getWalletBalance} />)
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
                    onDataChanged={onDataChanged}
                    getWalletBalance={addNewWalletBalance}
                />
            }
        </>
    )
}

export default Home;