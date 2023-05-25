import { useState, useEffect, useContext } from "react";
import GlobalBalanceContext from "../../Context/GlobalBalanceContext";
import { IWallet, IGlobalBalance } from "../../DataTypes";
import useTransaction from "../../Hooks/useTransaction";
import Transactions from "./Transactions";
import AddTransactionModal from "./AddTransactionModal";
import WalletModal from "./WalletModal";
import CurrencyToSign from "../../Utilities/CurrencyToSignConverter";
import MoneyToLocaleString from "../../Utilities/MoneyToLocaleString";
import { FcMoneyTransfer } from "react-icons/fc";
import { IoIosCash } from "react-icons/io";
import { BiDotsHorizontalRounded } from "react-icons/bi";

interface WalletProps {
    wallet: IWallet
    onDeleteWallet: (walletId: number, force: boolean) => Promise<void>
    onGetWallets: () => Promise<void>
    onChangeWallet: (changedWallet: IWallet) => Promise<void>
}

export default function Wallet({ wallet, onDeleteWallet, onGetWallets, onChangeWallet }: WalletProps) {
    const globalBalanceContext = useContext(GlobalBalanceContext);
    const { transactions, transactionsSum, handleAddTransactions, handleDeleteTransactions } = useTransaction(wallet.id!);
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

    const handleTransactionsModalClose = () => {
        setShowTransactionModal(false);
        onGetWallets();

    }
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


    return (
        <>
            <div className="wallet" onClick={handleWalletModalShow}>
                <div className="wallet-content">
                    <div>
                        <div className="wallet-header">
                            <div className="wallet-title min-width-0">
                                <h4 className="text-nowrap-overflow-ellipsis">{wallet.name}</h4>
                            </div>
                            <div className="wallet-title wallet-balance">
                                <h4>
                                    {MoneyToLocaleString(balance)}&nbsp;{CurrencyToSign(wallet.currency)}
                                </h4>
                            </div>
                        </div>
                    </div>

                    <div className="add-transactions">
                        <button className="btn add-items-button" type="button" key={"button-" + wallet.id}
                            onClick={(e) => handleTransactionsModalShow(e)}>
                            <IoIosCash />
                        </button>
                    </div>

                    <Transactions transactions={transactions} isFullMode={false} />

                    {transactions.length > 4 ?
                        <div className="transactions-dots">
                            <BiDotsHorizontalRounded />
                        </div>
                        : null}
                </div>
            </div>

            {showTransactionModal ?
                <AddTransactionModal
                    wallet={wallet}
                    show={showTransactionModal}
                    onClose={handleTransactionsModalClose}
                    onAddTransactions={handleAddTransactions}
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
                    transactions={transactions}
                    transactionsSum={transactionsSum}
                    onDeleteTransactions={handleDeleteTransactions}
                />
                : null
            }
        </>
    )
}