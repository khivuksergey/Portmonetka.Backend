import { useState, useEffect, useContext } from "react";
import GlobalBalanceContext from "../../Context/GlobalBalanceContext";
import { IWallet, IGlobalBalance } from "../../DataTypes";
import LatestTransactionsPreview from "./LatestTransactionsPreview";
import AddTransactionModal from "./AddTransactionModal";
import WalletModal from "./WalletModal";
import CurrencyToSign from "../../Utilities/CurrencyToSignConverter";
import MoneyToLocaleString from "../../Utilities/MoneyToLocaleString";
import { IoIosCash } from "react-icons/io";
import { BiDotsHorizontalRounded } from "react-icons/bi";

interface WalletProps {
    wallet: IWallet
    onDeleteWallet: (walletId: number, force: boolean) => Promise<void>
    //refreshWallets: () => void
    onChangeWallet: (changedWallet: IWallet) => Promise<void>
}

export default function Wallet({ wallet, onDeleteWallet, /*refreshWallets,*/ onChangeWallet }: WalletProps) {
    const globalBalanceContext = useContext(GlobalBalanceContext);

    const [balance, setBalance] = useState<number>(0);
    const [transactionsSum, setTransactionsSum] = useState<number>(0);
    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [showWalletModal, setShowWalletModal] = useState(false);

    //backend service in future
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

    const getTransactionsSum = (sum: number) => {
        setTransactionsSum(sum);
    }

    const handleTransactionsModalShow = (e: any) => {
        if (!e)
            e = window.event;
        e.stopPropagation();
        setShowTransactionModal(true);
    }

    const handleTransactionsModalClose = () => setShowTransactionModal(false);

    const handleWalletModalShow = () => setShowWalletModal(true);

    const handleWalletModalClose = () => setShowWalletModal(false);

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

                    <LatestTransactionsPreview walletId={wallet.id!} getTransactionsSum={getTransactionsSum} />

                    {/*{transactions.length > 4 ?*/}
                    {/*    <div className="transactions-dots">*/}
                    {/*        <BiDotsHorizontalRounded />*/}
                    {/*    </div>*/}
                    {/*    : null}*/}
                </div>
            </div>

            {showTransactionModal ?
                <AddTransactionModal
                    wallet={wallet}
                    show={showTransactionModal}
                    onClose={handleTransactionsModalClose}
                    //onAddTransactions={handleAddTransactions}
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
                    //transactions={transactions}
                    //transactionsSum={transactionsSum}
                    //onDeleteTransactions={handleDeleteMultipleTransactions}
                />
                : null
            }
        </>
    )
}