import { useRef, useState } from "react";
import { IWallet, IWalletProps } from "../../../DataTypes";
import TransactionsTable, { TransactionsTableRef } from "../Components/TransactionsTable";
import WalletPropertiesForm from "../Components/WalletPropertiesForm";
import ModalFooter from "../../../Components/ModalFooter";
import CurrencyToSign from "../../../Utilities/CurrencyToSignConverter";
import MoneyToLocaleString from "../../../Utilities/MoneyToLocaleString";
import Modal from "../../../Components/Modal";
import { Button } from "react-bootstrap";
import { MdDelete } from "react-icons/md";

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
        const deleted = await onDeleteWallet(wallet.id!);
        if (deleted) {
            onClose();
        }   
    }

    const currentWallet = {
        name: wallet.name,
        balance: wallet.initialAmount + transactionsSum,
        currency: CurrencyToSign(wallet.currency)
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
                    <Button className="btn-dark button--delete" style={{ marginRight: "auto" }} onClick={handleDeleteWallet}>
                        <MdDelete size={20} />
                    </Button>
                </ModalFooter>
            </WalletPropertiesForm>


        </Modal>
    )
}