import { useRef, useState } from "react";
import { IWallet, IWalletProps } from "../../../Common/DataTypes";
import { TransactionsTable, TransactionsTableRef, WalletPropertiesForm } from "../Components";
import { Modal, ModalFooter } from "../../../Components";
import { CurrencyToSign, MoneyToLocaleString } from "../../../Utilities";
import { IconDelete } from "../../../Common/Icons";

interface WalletModalProps {
    wallet: IWallet
    show: boolean
    onClose: (dataChanged?: boolean) => void
    onDeleteWallet: (id: number, force?: boolean) => Promise<boolean>
    onChangeWallet: (wallet: IWallet) => Promise<void>
}

export default function WalletModal({ wallet, show, onClose, onDeleteWallet, onChangeWallet }: WalletModalProps) {
    const transactionsTableRef = useRef<TransactionsTableRef>(null);

    const walletObject: IWalletProps = {
        name: wallet.name,
        currency: wallet.currency,
        initialAmount: wallet.initialAmount.toString()
    };

    const [transactionsSum, setTransactionsSum] = useState<number>(0);

    const getTransactionsSum = (sum: number) => {
        setTransactionsSum(sum);
    }

    const currentWallet = {
        name: wallet.name,
        balance: wallet.initialAmount + transactionsSum,
        currency: CurrencyToSign(wallet.currency)
    }

    const walletsAreSame = (w: IWallet, p: IWalletProps): boolean => {
        return w.name === p.name &&
            w.currency === p.currency &&
            w.initialAmount.toString() === p.initialAmount
    }

    const handleSubmit = async (walletObject: IWalletProps) => {
        let transactionsUpdated = false;

        if (transactionsTableRef.current) {
            transactionsUpdated = await transactionsTableRef.current.updateTransactions();
        }

        if (!walletsAreSame(wallet, walletObject)) {
            const changedWallet: IWallet = {
                id: wallet.id,
                dateCreated: wallet.dateCreated,
                name: walletObject.name.trim(),
                currency: walletObject.currency.toUpperCase(),
                initialAmount: parseFloat(walletObject.initialAmount)
            }
            onChangeWallet(changedWallet);
        }

        onClose(transactionsUpdated);
    }

    const handleDeleteWallet = async () => {
        if (transactionsTableRef.current) {
            const count = transactionsTableRef.current.getTransactionsCount();
            if (count === 0 && !window.confirm(`Are you sure you want to delete ${wallet.name} wallet?`)) {
                return;
            }
        }

        const deleted = await onDeleteWallet(wallet.id!);
        if (deleted) {
            onClose();
        }
    }

    const modalTitle =
        <div className="wallet-header">
            <div className="wallet-title min-width-0">
                <h4 className="text-nowrap-overflow-ellipsis">{currentWallet.name}</h4>
            </div>
            <div className="wallet-title wallet-balance">
                <h4>
                    {MoneyToLocaleString(currentWallet.balance)}&nbsp;{currentWallet.currency}
                </h4>
            </div>
        </div>

    if (!show) return null;

    return (
        <Modal title={modalTitle} show={show} onClose={onClose} size="lg" contentClassName="modal-container">
            <WalletPropertiesForm
                initialValues={walletObject}
                handleSubmit={(wallet) => handleSubmit(wallet)}
            >
                <TransactionsTable
                    ref={transactionsTableRef}
                    walletId={wallet.id!}
                    getTransactionsSum={getTransactionsSum}
                />

                <ModalFooter onReset={() => { onClose() }}>
                    <button type="button" className="button--dark button--delete" style={{ marginRight: "auto" }} onClick={handleDeleteWallet}>
                        <IconDelete size={20} />
                    </button>
                </ModalFooter>
            </WalletPropertiesForm>
        </Modal>
    )
}