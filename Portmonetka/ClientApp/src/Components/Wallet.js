import { useEffect, useState } from 'react';
import getSymbolFromCurrency from 'currency-symbol-map';
import Transactions from "./Transactions";
import TransactionModal from "./TransactionModal";
import WalletModal from "./WalletModal";
import { GiCat } from 'react-icons/gi';
import { FcMoneyTransfer } from 'react-icons/fc';

function Wallet({ wallet, onDataChanged, getWalletBalance }) {
    const [openTransactionModal, setOpenTransactionModal] = useState(false);
    const [showWalletModal, setShowWalletModal] = useState(false);

    const handleTransactionsModalClose = () => setOpenTransactionModal(false);
    const handleTransactionsModalShow = (e) => {
        if (!e) e = window.event;
        e.stopPropagation();
        setOpenTransactionModal(true);
    }

    const handleWalletModalClose = () => {
        setShowWalletModal(false);

    }
    const handleWalletModalShow = () => setShowWalletModal(true);

    const [transactionsSum, setTransactionsSum] = useState();
    const [balance, setBalance] = useState();

    useEffect(() => {
        setBalance(wallet.InitialAmount + transactionsSum);
    }, [transactionsSum, wallet.InitialAmount]);

    useEffect(() => {
        getWalletBalance({ currency: wallet.Currency, amount: balance });
    }, [balance, wallet.Currency]);


    const calcTransactionsSum = (value) => {
        setTransactionsSum(value);
    }

    const dataChanged = () => {
        onDataChanged();
    }

    function currencyToSign(currency) {
        if (currency.toUpperCase() === 'KUS') {
            return <i><GiCat className="kusya" /></i>
        } else {
            return getSymbolFromCurrency(currency);
        }
    }

    return (
        <>
            <div className="wallet" onClick={handleWalletModalShow}>
                <div className="wallet-header">
                    <h4 className="text-nowrap">{wallet.Name} </h4>
                    <h4 className="text-nowrap ms-auto">{balance}&nbsp;{currencyToSign(wallet.Currency)}</h4>

                </div>

                <div className="d-grid">
                    <button className="btn btn-dark add-items-button" type="button" key={"button-" + wallet.Id}
                        onClick={(e) => handleTransactionsModalShow(e)}>
                        <FcMoneyTransfer/>
                    </button>
                </div>

                <Transactions wallet={wallet} calcTransactionsSum={calcTransactionsSum} isFullMode={false} onDataChanged={ dataChanged} />

            </div>

            {openTransactionModal &&
                <TransactionModal
                    walletId={wallet.Id}
                    open={openTransactionModal}
                    onClose={handleTransactionsModalClose}
                    onDataChanged={dataChanged}
                />
            }

            {showWalletModal &&
                <WalletModal
                    wallet={wallet}
                    open={showWalletModal}
                    onClose={handleWalletModalClose}
                    onDataChanged={dataChanged}
                />
            }
        </>
    )
}

export default Wallet;