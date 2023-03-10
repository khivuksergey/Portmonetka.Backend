import { useState, useEffect, useContext } from "react";
import GlobalBalanceContext from "../../Context/GlobalBalanceContext";
import Transactions from "./Transactions";
import TransactionModal from "./TransactionModal";
import WalletModal from "./WalletModal";
import currencyToSign from "../../Utilities/CurrencyToSignConverter";
import { FcMoneyTransfer } from "react-icons/fc";

function Wallet({ wallet, onDeleteWallet, onGetWallets }) {
    const { walletsBalance, setWalletsBalance } = useContext(GlobalBalanceContext);
    const [transactionsSum, setTransactionsSum] = useState();
    const [balance, setBalance] = useState();

    //useMemo for future, set timeout for the last value?
    useEffect(() => {
        const newBalance = {
            id: wallet.Id,
            currency: wallet.Currency,
            amount: wallet.InitialAmount + transactionsSum
        };
        setWalletsBalance((prev) => {
            if (!!prev) {
                return [...prev.filter((o) => o.id !== newBalance.id), { ...newBalance }];
            } else {
                return newBalance;
            }
                
        });
        setBalance(newBalance.amount);
        //console.log('walletsBalance: ', walletsBalance);
        //console.log(`transactionsSum: ${transactionsSum}`);
    }, [transactionsSum, wallet.InitialAmount, wallet.Currency]);


    const [openTransactionModal, setOpenTransactionModal] = useState(false);
    const [showWalletModal, setShowWalletModal] = useState(false);

    const handleTransactionsModalClose = () => setOpenTransactionModal(false);
    const handleTransactionsModalShow = (e) => {
        if (!e)
            e = window.event;
        e.stopPropagation();
        setOpenTransactionModal(true);
    }

    const handleWalletModalClose = () => {
        onGetWallets();
        setShowWalletModal(false);
    }
    const handleWalletModalShow = () => setShowWalletModal(true);

    const calcTransactionsSum = (value) => {
        setTransactionsSum(value);
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

                <Transactions wallet={wallet} calcTransactionsSum={calcTransactionsSum} isFullMode={false} />

            </div>

            {openTransactionModal &&
                <TransactionModal
                    walletId={wallet.Id}
                    open={openTransactionModal}
                    onClose={handleTransactionsModalClose}
                />
            }

            {showWalletModal &&
                <WalletModal
                    wallet={wallet}
                    open={showWalletModal}
                    onClose={handleWalletModalClose}
                    onDeleteWallet={onDeleteWallet}
                />
            }
        </>
    )
}

export default Wallet;