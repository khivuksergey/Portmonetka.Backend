import { useState, useContext } from "react";
import Transactions from "./Transactions";
import { IWallet, IGlobalBalance } from "../../DataTypes";
import CurrencyToSign from "../../Utilities/CurrencyToSignConverter";
import GlobalBalanceContext from "../../Context/GlobalBalanceContext";
import Modal from "../../Components/Modal";
import SubmitButton from "../../Components/SubmitButton";
import { Form, Row, Col, Button } from "react-bootstrap";
import { MdDelete } from "react-icons/md";

interface WalletModalProps {
    wallet: IWallet
    show: boolean
    onClose: () => void
    onDeleteWallet: (id: number, force: boolean) => Promise<void>
    onChangeWallet: (wallet: IWallet) => Promise<void>
}

export default function WalletModal({ wallet, show, onClose, onDeleteWallet, onChangeWallet }: WalletModalProps) {
    const [walletObject, setWalletObject] = useState(wallet);
    const [transactionsSum, setTransactionsSum] = useState(0);
    const globalBalanceContext = useContext(GlobalBalanceContext);

    const handleWalletDataChange = (property: string, value: string) => {
        setWalletObject({ ...walletObject, [property]: value });
    }

    const calcTransactionsSum = (value: number) => {
        setTransactionsSum(value);
    }

    const walletsAreSame = (a: IWallet, b: IWallet): boolean => {
        return a.name === b.name ||
            a.currency === b.currency ||
            a.initialAmount === b.initialAmount
    }

    const onSubmit = async () => {
        if (!walletsAreSame(wallet, walletObject)) {
            console.log(walletObject);
            onChangeWallet(walletObject)
                .then(() => {//check for errors while changing and so on
                        const newBalance = {
                            id: walletObject.id,
                            currency: walletObject.currency,
                            amount: walletObject.initialAmount! + transactionsSum
                        };
                        globalBalanceContext!.setGlobalBalance((prev: IGlobalBalance[]) => {
                            return [...prev.filter((o) => o.id !== newBalance.id), { ...newBalance }];
                        });
                    });;
        }
        onClose();
    }

    const handleDeleteWallet = async () => {
        if (window.confirm(`Are you sure you want to delete ${wallet.name} wallet?`) === true) {
            onDeleteWallet(wallet.id!, false);
            onClose();
        }
    }

    const modalTitle =
        <>
            <big style={{ marginRight: "2rem" }}>{walletObject.name}</big>
            <big>{wallet.initialAmount! + transactionsSum} {CurrencyToSign(walletObject.currency)}</big>
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
                                id="Name"
                                type="text"
                                placeholder="Wallet Title"
                                value={walletObject.name} maxLength={128}
                                onChange={e => {
                                    handleWalletDataChange(e.target.id, e.target.value)
                                }}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={3}>
                        <Form.Group>
                            <Form.Label>Currency</Form.Label>
                            <Form.Control
                                id="Currency"
                                type="text"
                                placeholder="USD"
                                value={walletObject.currency} maxLength={3}
                                onChange={e => {
                                    handleWalletDataChange(e.target.id, e.target.value.toUpperCase())
                                }}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={4}>
                        <Form.Group>
                            <Form.Label>Initial Balance</Form.Label>
                            <Form.Control
                                id="InitialAmount"
                                type="number"
                                placeholder="10000"
                                value={walletObject.initialAmount} min={0}
                                onChange={e => {
                                    handleWalletDataChange(e.target.id, e.target.value)
                                }}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>
            </Form>

            <Transactions wallet={wallet} calcTransactionsSum={calcTransactionsSum} isFullMode={true} />


            <div className="modal-footer">
                <Button className="btn btn-delete-wallet" onClick={handleDeleteWallet}>
                    <MdDelete size={20} />
                </Button>
                <SubmitButton onSubmit={onSubmit} text="Save"/>
            </div>
        </Modal>
    )
}