import { useState, useEffect, useContext } from "react";
import GlobalBalanceContext from "../../Context/GlobalBalanceContext";
import { IWallet, IGlobalBalance } from "../../DataTypes";
import Transactions from "./Transactions";
import AddTransactionModal from "./AddTransactionModal";
import WalletModal from "./WalletModal";
import CurrencyToSign from "../../Utilities/CurrencyToSignConverter";
import { FcMoneyTransfer } from "react-icons/fc";

interface WalletProps {
    wallet: IWallet
    onDeleteWallet: (walletId: number, force: boolean) => Promise<void>
    onGetWallets: () => Promise<void>
    onChangeWallet: (changedWallet: IWallet) => Promise<void>
}

export default function Wallet({ wallet, onDeleteWallet, onGetWallets, onChangeWallet }: WalletProps) {
    const globalBalanceContext = useContext(GlobalBalanceContext);
    const [transactionsSum, setTransactionsSum] = useState<number>(0);
    const [balance, setBalance] = useState<number>(0);

    //useMemo for future
    useEffect(() => {
        const newBalance = {
            id: wallet.id,
            currency: wallet.currency,
            amount: wallet.initialAmount! + transactionsSum
        };
        globalBalanceContext!.setGlobalBalance((prev: IGlobalBalance[]) => {
            if (!!prev) {
                return [...prev.filter((o) => o.id !== newBalance.id), { ...newBalance }];
            } else {
                return newBalance;
            }

        });
        setBalance(newBalance.amount);
    }, [transactionsSum, wallet.initialAmount, wallet.currency]);


    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [showWalletModal, setShowWalletModal] = useState(false);

    const handleTransactionsModalClose = () => setShowTransactionModal(false);
    const handleTransactionsModalShow = (e: any) => {
        if (!e)
            e = window.event;
        e.stopPropagation();
        setShowTransactionModal(true);
    }

    const handleWalletModalClose = () => {
        onGetWallets();
        setShowWalletModal(false);
    }
    const handleWalletModalShow = () => setShowWalletModal(true);

    const calcTransactionsSum = (value: number) => {
        setTransactionsSum(value);
    }

    return (
        <>
            <div className="wallet" onClick={handleWalletModalShow}>
                <div className="wallet-header">
                    <h4 className="text-nowrap d-inlineblock text-truncate">{wallet.name} </h4>
                    <h4 className="text-nowrap ms-auto">{balance}&nbsp;{CurrencyToSign(wallet.currency)}</h4>

                </div>

                <div className="d-grid">
                    <button className="btn btn-dark add-items-button" type="button" key={"button-" + wallet.id}
                        onClick={(e) => handleTransactionsModalShow(e)}>
                        <FcMoneyTransfer />
                    </button>
                </div>

                <Transactions wallet={wallet} calcTransactionsSum={calcTransactionsSum} isFullMode={false} />

            </div>

            {showTransactionModal ?
                <AddTransactionModal
                    wallet={wallet}
                    show={showTransactionModal}
                    onClose={handleTransactionsModalClose}
                />
                : null
            }

            {showWalletModal ?
                <WalletModal
                    wallet={wallet}
                    show={showWalletModal}
                    onClose={handleWalletModalClose}
                    onDeleteWallet={onDeleteWallet}
                    onChangeWallet={onChangeWallet}
                />
                : null
            }
        </>
    )
}