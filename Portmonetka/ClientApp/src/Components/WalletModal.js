import { useState } from 'react';
import axios from 'axios';
import getSymbolFromCurrency from 'currency-symbol-map';
import Modal from "react-bootstrap/Modal";
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from "react-bootstrap/Button";
import Transactions from "./Transactions";
import { MdDelete } from 'react-icons/md'

const WalletModal = ({ wallet, open, onClose, onSaved }) => {
    const [walletName, setWalletName] = useState(wallet.Name);
    const [walletCurrency, setWalletCurrency] = useState(wallet.Currency);
    const [walletInitialAmount, setWalletInitialAmount] = useState(wallet.InitialAmount);
    const [transactionsSum, setTransactionsSum] = useState();

    const handleWalletNameChange = (e) => {
        setWalletName(e.target.value);
    }

    const handleWalletCurrencyChange = (e) => {
        setWalletCurrency(e.target.value.toUpperCase());
    }

    const handleWalletInitialAmountChange = (e) => {
        setWalletInitialAmount(e.target.value);
    }

    const calcBalance = (value) => {
        setTransactionsSum(value);
    }

    const onSubmit = () => {
        if (wallet.Name !== walletName || wallet.Currency !== walletCurrency || wallet.InitialAmount !== walletInitialAmount) {
            const url = `api/wallet/${wallet.Id}`;
            let data = {
                "Id": wallet.Id,
                "Name": walletName,
                "Currency": walletCurrency,
                "InitialAmount": walletInitialAmount,
                "IconFileName": wallet.IconFileName
            };
            axios.put(url, data);
        }
        onSaved();
    }

    const onDeleteWallet = async () => {
        if (window.confirm(`Are you sure you want to delete ${walletName} wallet?`) === true) {
            deleteTransactionsByWallet(wallet.Id);
        }
    }

    const deleteTransactionsByWallet = async (walletId) => {
        const url = `api/transaction/delete/wallet/${walletId}`;
        try {
            await axios.delete(url)
                .then(() => deleteWallet(walletId))
        } catch (error) {
            console.error(error);
        }
    }

    const deleteWallet = async (walletId) => {
        const url = `api/wallet/${walletId}`;
        try {
            await axios.delete(url)
                .then(() => onSaved())
        } catch (error) {
            console.error(error);
        }
    }

    if (!open) return null;

    return (
        <Modal show={open} onHide={onClose} backdrop="static" contentClassName="modal-container" size="md" fullscreen="md-down" centered>

            <Modal.Header closeButton>
                <Modal.Title>
                    <big style={{ marginRight: "2rem" }}>{walletName}</big>
                    <big>{wallet.InitialAmount + transactionsSum} {getSymbolFromCurrency(walletCurrency)}</big>
                </Modal.Title>
            </Modal.Header>

            <Modal.Body >
                <Form onSubmit={onSubmit} /*noValidate*/>
                    <Row>
                        <Col xs={12} md={5}>
                            <Form.Group>
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Wallet Title"
                                    aria-label="Title of your wallet"
                                    value={walletName} maxLength="255"
                                    onChange={e => {
                                        handleWalletNameChange(e)
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
                                    aria-label="Currency"
                                    value={walletCurrency} maxLength="3"
                                    onChange={e => {
                                        handleWalletCurrencyChange(e)
                                    }}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} md={4}>
                            <Form.Group>
                                <Form.Label>Balance</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="10000"
                                    aria-label="Initial balance"
                                    value={walletInitialAmount} min="0"
                                    onChange={e => {
                                        handleWalletInitialAmountChange(e)
                                    }}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>

                <Transactions wallet={wallet} calcBalance={calcBalance} isFullMode={true} onDataChanged={onSaved} />

            </Modal.Body>

            <Modal.Footer>
                <Button className="btn btn-delete-wallet" onClick={onDeleteWallet}>
                    <MdDelete size={20} />
                </Button>
                <Button variant="primary" onClick={onSubmit}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default WalletModal;