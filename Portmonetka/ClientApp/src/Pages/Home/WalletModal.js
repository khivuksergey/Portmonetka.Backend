import { useState, useContext } from "react";
import axios from "axios";
import currencyToSign from "../../Utilities/CurrencyToSignConverter";
import GlobalBalanceContext from "../../Context/GlobalBalanceContext";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Transactions from "./Transactions";
import { MdDelete } from "react-icons/md";

const WalletModal = ({ wallet, open, onClose, onDeleteWallet }) => {
    const [walletObject, setWalletObject] = useState(wallet);
    const [transactionsSum, setTransactionsSum] = useState();
    const { walletsBalance, setWalletsBalance } = useContext(GlobalBalanceContext);

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
            try {
                axios.put(url, data)
                    .then(() => {
                        const newBalance = {
                            id: walletObject.Id,
                            currency: walletObject.Currency,
                            amount: walletObject.InitialAmount + transactionsSum
                        };
                        setWalletsBalance((prev) => {
                            return [...prev.filter((o) => o.id !== newBalance.id), { ...newBalance }];
                        });
                        //console.log('new walletsBalance: ', [...walletsBalance.filter((o) => o.id !== newBalance.id), { ...newBalance }]);
                    });
            } catch (error) {
                console.error(error);
            }
        }
        onClose();
    }

    const handleDeleteWallet = async () => {
        if (window.confirm(`Are you sure you want to delete ${wallet.Name} wallet?`) === true) {
            onDeleteWallet(wallet.Id);
            onClose();
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

                <Transactions wallet={wallet} calcTransactionsSum={calcTransactionsSum} isFullMode={true} />

            </Modal.Body>

            <Modal.Footer>
                <Button className="btn btn-delete-wallet" onClick={handleDeleteWallet}>
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