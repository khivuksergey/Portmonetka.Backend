import { useState, useEffect, useContext, useRef } from "react";
import GlobalBalanceContext from "../../../Context/GlobalBalanceContext";
import { IWallet, IGlobalBalance } from "../../../Common/DataTypes";
import LatestTransactionsPreview, { LatestTransactionsPreviewRef } from "./LatestTransactionsPreview";
import { AddTransactionModal, WalletModal } from "../Modals";
import { CurrencyToSign, MoneyToLocaleString } from "../../../Utilities";
import { IconCash } from "../../../Common/Icons";

interface WalletProps {
    wallet: IWallet
    onDeleteWallet: (walletId: number, force?: boolean) => Promise<boolean>
    onChangeWallet: (changedWallet: IWallet) => Promise<void>
}

export default function Wallet({ wallet, onDeleteWallet, onChangeWallet }: WalletProps) {
    const globalBalanceContext = useContext(GlobalBalanceContext);

    const [balance, setBalance] = useState<number>(0);
    const [transactionsSum, setTransactionsSum] = useState<number>(0);
    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [showWalletModal, setShowWalletModal] = useState(false);

    const latestTransactionsPreviewRef = useRef<LatestTransactionsPreviewRef>();

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

    const handleTransactionsModalClose = (dataAdded: boolean) => {
        if (dataAdded && latestTransactionsPreviewRef.current) {
            latestTransactionsPreviewRef.current.refreshTransactions();
        }
        setShowTransactionModal(false);
    };

    const handleWalletModalShow = () => setShowWalletModal(true);

    const handleWalletModalClose = (dataChanged?: boolean) => {
        if (dataChanged && latestTransactionsPreviewRef.current) {
            latestTransactionsPreviewRef.current.refreshTransactions();
        }
        setShowWalletModal(false);
    }

    return (
        <>
            <div className="wallet" onClick={handleWalletModalShow}>
                <div className="wallet-content">
                    <div className="wallet__header">
                        <div className="min-width-0">
                            <h4 className="text-nowrap-overflow-ellipsis">{wallet.name}</h4>
                        </div>
                        <div className="wallet__balance">
                            <h4>
                                {MoneyToLocaleString(balance)}&nbsp;{CurrencyToSign(wallet.currency)}
                            </h4>
                        </div>
                    </div>

                    <div style={{ display: "grid", width: "100%" }}>
                        <button type="button" className="add-transactions__button" key={"button-" + wallet.id}
                            onClick={(e) => handleTransactionsModalShow(e)}
                        >
                            <IconCash />
                        </button>
                    </div>

                    <LatestTransactionsPreview walletId={wallet.id!} getTransactionsSum={getTransactionsSum} ref={latestTransactionsPreviewRef} />

                </div>
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