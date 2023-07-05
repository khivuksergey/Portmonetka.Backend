import { useState } from "react";
import TransactionsTable from "./TransactionsTable";
import { IWallet, IWalletProps } from "../../DataTypes";
import CurrencyToSign from "../../Utilities/CurrencyToSignConverter";
import MoneyToLocaleString from "../../Utilities/MoneyToLocaleString";
import Modal from "../../Components/Modal";
import { Button } from "react-bootstrap";
import { MdDelete } from "react-icons/md";
import ModalFooter from "../../Components/ModalFooter";
import WalletPropertiesForm from "./WalletPropertiesForm";

interface WalletModalProps {
    wallet: IWallet
    show: boolean
    onClose: () => void
    onDeleteWallet: (id: number, force: boolean) => Promise<void>
    onChangeWallet: (wallet: IWallet) => Promise<void>
    //transactions: ITransaction[]
    //transactionsSum: number
    //onDeleteTransactions: (ids: number[]) => Promise<void>
}

//enum WalletPropsType {
//    Name,
//    Currency,
//    InitialAmount
//}

export default function WalletModal({ wallet, show, onClose, onDeleteWallet, onChangeWallet/*, transactions*//*, transactionsSum*//*, onDeleteTransactions*/ }: WalletModalProps) {
    const walletObject: IWalletProps = {
        name: wallet.name,
        currency: wallet.currency,
        initialAmount: wallet.initialAmount.toString()
    };

    const [transactionsSum, setTransactionsSum] = useState<number>(0);

    const getTransactionsSum = (sum: number) => {
        setTransactionsSum(sum);
    }

    //const handleWalletDataChange = (field: WalletPropsType, e: React.ChangeEvent<HTMLInputElement>) => {
    //    switch (field) {
    //        case WalletPropsType.Name:
    //            setWalletObject({ ...walletObject, name: e.target.value });
    //            break;
    //        case WalletPropsType.Currency:
    //            setWalletObject({ ...walletObject, currency: e.target.value.toUpperCase() })
    //            break;
    //        case WalletPropsType.InitialAmount:
    //            let initialAmount = e.target.value;
    //            if (initialAmount[0] === "0" && initialAmount.length > 1)
    //                initialAmount = initialAmount.substring(1);
    //            setWalletObject({ ...walletObject, initialAmount: Number(initialAmount) })
    //            break;
    //        default:
    //            console.log("Invalid wallet property type");
    //            break;
    //    }
    //}

    //let transactionIdsToDelete: number[] = [];

    //const onAddTransactionIdToDeleteList = (id: number) => {
    //    transactionIdsToDelete = [...transactionIdsToDelete, id];
    //}

    //const onRemoveTransactionIdFromDeleteList = (id: number) => {
    //    transactionIdsToDelete = transactionIdsToDelete.filter(t => t !== id);
    //}

    const walletsAreSame = (w: IWallet, p: IWalletProps): boolean => {
        return w.name === p.name &&
            w.currency === p.currency &&
            w.initialAmount.toString() === p.initialAmount
    }

    const handleSubmit = (walletObject: IWalletProps) => {
        if (!walletsAreSame(wallet, walletObject)) {
            const changedWallet: IWallet = {
                id: wallet.id,
                name: walletObject.name.trim(),
                currency: walletObject.currency.toUpperCase(),
                initialAmount: parseFloat(walletObject.initialAmount)
            }
            console.log(changedWallet);
            onChangeWallet(changedWallet);
        }

        //const itemsCount = transactionIdsToDelete.length;

        //if (itemsCount > 0 &&
        //    window.confirm(`Are you sure you want to delete ${itemsCount} item${itemsCount > 1 ? `s` : ``}?`) === true) {
        //    onDeleteTransactions(transactionIdsToDelete);
        //}
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
        <Modal title={modalTitle} show={show} onClose={onClose} size="lg" contentClassName="modal-container" /*fullscreen="md-down" centered*/>
            <WalletPropertiesForm
                initialValues={walletObject}
                handleSubmit={(wallet) => handleSubmit(wallet)}
            >
                <TransactionsTable
                    /*transactions={transactions}*/
                    /*onDeleteTransaction={onAddTransactionIdToDeleteList}*/
                    /*onRestoreTransaction={onRemoveTransactionIdFromDeleteList}*/
                    walletId={wallet.id!}
                    getTransactionsSum={getTransactionsSum}
                />

                <ModalFooter onReset={onClose}>
                    <Button className="btn-dark button--delete" style={{ marginRight: "auto" }} onClick={handleDeleteWallet}>
                        <MdDelete size={20} />
                    </Button>
                </ModalFooter>
            </WalletPropertiesForm>


        </Modal>
    )
}

//{ <Form onSubmit={onSubmit} /*noValidate>*/}
//                <Row>
//                    <Col xs={12} sm={5}>
//                        <Form.Group>
//                            <Form.Label>Title</Form.Label>
//                            <Form.Control
//                                className="form-control--dark"
//                                type="text"
//                                placeholder="Wallet Title"
//                                value={walletObject.name} maxLength={128}
//                                onChange={e => {
//                                    handleWalletDataChange(WalletPropsType.Name, e as any)
//                                }}
//                                required
//                            />
//                        </Form.Group>
//                    </Col>
//                    <Col xs={12} sm={3}>
//                        <Form.Group>
//                            <Form.Label>Currency</Form.Label>
//                            <Form.Control
//                                className="form-control--dark"
//                                type="text"
//                                placeholder="USD"
//                                value={walletObject.currency} minLength={3} maxLength={3}
//                                onChange={e => {
//                                    handleWalletDataChange(WalletPropsType.Currency, e as any)
//                                }}
//                                required
//                            />
//                        </Form.Group>
//                    </Col>
//                    <Col xs={12} sm={4}>
//                        <Form.Group>
//                            <Form.Label>Initial Balance</Form.Label>
//                            <Form.Control
//                                className="form-control--dark"
//                                type="number"
//                                step="any"
//                                placeholder="10000"
//                                value={walletObject.initialAmount ?? ''} min={0}
//                                onChange={e => {
//                                    handleWalletDataChange(WalletPropsType.InitialAmount, e as any)
//                                }}
//                                required
//                            />
//                        </Form.Group>
//                    </Col>
//                </Row>

//                <TransactionsTable
//            {        /*transactions={transactions}*/}
//            {        /*onDeleteTransaction={onAddTransactionIdToDeleteList}*/}
//            {        /*onRestoreTransaction={onRemoveTransactionIdFromDeleteList}*/}
//                    walletId={wallet.id!}
//                    getTransactionsSum={getTransactionsSum}
//                />

//                <ModalFooter onReset={onClose}>
//                    <Button className="btn-dark button--delete" style={{ marginRight: "auto" }} onClick={handleDeleteWallet}>
//                        <MdDelete size={20} />
//                    </Button>
//                </ModalFooter>

//            </Form >