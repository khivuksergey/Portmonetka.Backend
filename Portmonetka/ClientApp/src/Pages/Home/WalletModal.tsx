import { useState, useContext } from "react";
import Transactions from "./Transactions";
import { IWallet, ITransaction, IGlobalBalance } from "../../DataTypes";
import CurrencyToSign from "../../Utilities/CurrencyToSignConverter";
import MoneyToLocaleString from "../../Utilities/MoneyToLocaleString";
import GlobalBalanceContext from "../../Context/GlobalBalanceContext";
import Modal from "../../Components/Modal";
import { Form, Row, Col, Button } from "react-bootstrap";
import { MdDelete } from "react-icons/md";

interface WalletModalProps {
    wallet: IWallet
    show: boolean
    onClose: () => void
    onDeleteWallet: (id: number, force: boolean) => Promise<void>
    onChangeWallet: (wallet: IWallet) => Promise<void>
    transactions: ITransaction[]
    transactionsSum: number
    onDeleteTransactions: (ids: number[]) => Promise<void>
}

enum WalletPropsType {
    Name,
    Currency,
    InitialAmount
}

export default function WalletModal({ wallet, show, onClose, onDeleteWallet, onChangeWallet, transactions, transactionsSum, onDeleteTransactions }: WalletModalProps) {
    const [walletObject, setWalletObject] = useState(wallet);

    const handleWalletDataChange = (field: WalletPropsType, e: React.ChangeEvent<HTMLInputElement>) => {
        switch (field) {
            case WalletPropsType.Name:
                setWalletObject({ ...walletObject, name: e.target.value });
                break;
            case WalletPropsType.Currency:
                setWalletObject({ ...walletObject, currency: e.target.value.toUpperCase() })
                break;
            case WalletPropsType.InitialAmount:
                let initialAmount = e.target.value;
                if (initialAmount[0] === "0" && initialAmount.length > 1)
                    initialAmount = initialAmount.substring(1);
                setWalletObject({ ...walletObject, initialAmount: Number(initialAmount) })
                break;
            default:
                console.log("Invalid wallet property type");
                break;
        }
    }

    let transactionIdsToDelete: number[] = [];

    const onAddTransactionIdToDeleteList = (id: number) => {
        transactionIdsToDelete = [...transactionIdsToDelete, id];
    }

    const onRemoveTransactionIdFromDeleteList = (id: number) => {
        transactionIdsToDelete = transactionIdsToDelete.filter(t => t !== id);
    }

    const walletsAreSame = (a: IWallet, b: IWallet): boolean => {
        return a.name === b.name &&
            a.currency === b.currency &&
            a.initialAmount === b.initialAmount
    }

    const onSubmit = async () => {
        if (!walletsAreSame(wallet, walletObject)) {
            console.log(walletObject);
            onChangeWallet(walletObject);
        }

        const itemsCount = transactionIdsToDelete.length;

        if (itemsCount > 0 &&
            window.confirm(`Are you sure you want to delete ${itemsCount} item${itemsCount > 1 ? `s` : ``}?`) === true) {
            onDeleteTransactions(transactionIdsToDelete);
        }
        onClose();
    }

    const handleDeleteWallet = async () => {
        if (window.confirm(`Are you sure you want to delete ${wallet.name} wallet?`) === true) {
            onDeleteWallet(wallet.id!, false);
            onClose();
        }
    }

    const currentWallet = {
        name: wallet.name,
        balance: wallet.initialAmount + transactionsSum,
        currency: CurrencyToSign(wallet.currency)
    }

    const modalTitle =
        <>
            <big style={{ marginRight: "2rem" }}>{currentWallet.name}</big>
            <big>{MoneyToLocaleString(currentWallet.balance)} {currentWallet.currency}</big>
        </>

    if (!show) return null;

    return (
        <Modal title={modalTitle} show={show} onClose={onClose} contentClassName="modal-container" /*fullscreen="md-down" centered*/>
            <Form onSubmit={onSubmit} /*noValidate*/>
                <Row>
                    <Col xs={12} md={5}>
                        <Form.Group>
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Wallet Title"
                                value={walletObject.name} maxLength={128}
                                onChange={e => {
                                    handleWalletDataChange(WalletPropsType.Name, e as any)
                                }}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={3}>
                        <Form.Group>
                            <Form.Label>Currency</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="USD"
                                value={walletObject.currency} minLength={3} maxLength={3}
                                onChange={e => {
                                    handleWalletDataChange(WalletPropsType.Currency, e as any)
                                }}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={4}>
                        <Form.Group>
                            <Form.Label>Initial Balance</Form.Label>
                            <Form.Control
                                type="number"
                                step="any"
                                placeholder="10000"
                                value={walletObject.initialAmount ?? ''} min={0}
                                onChange={e => {
                                    handleWalletDataChange(WalletPropsType.InitialAmount, e as any)
                                }}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>
            </Form>

            <Transactions
                transactions={transactions}
                onDeleteTransaction={onAddTransactionIdToDeleteList}
                onRestoreTransaction={onRemoveTransactionIdFromDeleteList}
                isFullMode={true} />


            <div className="modal-footer">
                <Button variant="secondary" className="delete-btn" onClick={handleDeleteWallet}>
                    <MdDelete size={20} />
                </Button>

                <Button variant="secondary" type="reset" className="cancel-btn" onClick={onClose}>
                    Cancel
                </Button>

                <Button variant="primary" className="ok-btn" onClick={onSubmit}>
                    Save
                </Button>
            </div>
        </Modal>
    )
}