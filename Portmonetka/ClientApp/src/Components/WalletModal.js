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
import { GiCat } from 'react-icons/gi';

const WalletModal = ({ wallet, open, onClose, onDataChanged }) => {
    const [walletObject, setWalletObject] = useState(wallet);

    const [transactionsSum, setTransactionsSum] = useState();

    const handleWalletDataChange = (property, value) => {
        setWalletObject({ ...walletObject, [property]: value });
    }

    const calcTransactionsSum = (value) => {
        setTransactionsSum(value);
    }

    const onSubmit = () => {
        if (wallet.Name !== walletObject.Name || wallet.Currency !== walletObject.Currency || wallet.InitialAmount !== walletObject.InitialAmount) {
            const url = `api/wallet/${wallet.Id}`;
            let data = {
                "Id": walletObject.Id,
                "Name": walletObject.Name,
                "Currency": walletObject.Currency,
                "InitialAmount": walletObject.InitialAmount,
                "IconFileName": walletObject.IconFileName
            };
            axios.put(url, data);
        }
        onDataChanged();
        onClose();
    }

    const onDeleteWallet = async () => {
        if (window.confirm(`Are you sure you want to delete ${wallet.Name} wallet?`) === true) {
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
                .then(() => onDataChanged())
        } catch (error) {
            console.error(error);
        }
    }

    function currencyToSign(currency) {
        if (currency.toUpperCase() === 'KUS') {
            return <i><GiCat className="kusya" /></i>
        } else {
            return getSymbolFromCurrency(currency);
        }
    }

    if (!open) return null;

    return (
        <Modal show={open} onHide={onClose} backdrop="static" contentClassName="modal-container" size="md" fullscreen="md-down" centered>

            <Modal.Header closeButton>
                <Modal.Title>
                    <big style={{ marginRight: "2rem" }}>{walletObject.Name}</big>
                    <big>{wallet.InitialAmount + transactionsSum} {currencyToSign(walletObject.Currency)}</big>
                </Modal.Title>
            </Modal.Header>

            <Modal.Body >
                <Form onSubmit={onSubmit} /*noValidate*/>
                    <Row>
                        <Col xs={12} md={5}>
                            <Form.Group>
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    id="Name"
                                    type="text"
                                    placeholder="Wallet Title"
                                    aria-label="Title of your wallet"
                                    value={walletObject.Name} maxLength="255"
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
                                    aria-label="Currency"
                                    value={walletObject.Currency} maxLength="3"
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
                                    aria-label="Initial balance"
                                    value={walletObject.InitialAmount} min="0"
                                    onChange={e => {
                                        handleWalletDataChange(e.target.id, e.target.value)
                                    }}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>

                <Transactions wallet={wallet} calcTransactionsSum={calcTransactionsSum} isFullMode={true} onDataChanged={onDataChanged} />

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