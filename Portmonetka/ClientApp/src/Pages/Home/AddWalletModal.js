import { useState } from 'react';
import axios from 'axios';
import Modal from "react-bootstrap/Modal";
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from "react-bootstrap/Button";

const AddWalletModal = ({ open, onClose, onDataChanged, getWalletBalance }) => {
    const [wallet, setWallet] = useState({
        name: "",
        initialAmount: "",
        currency: "",
        iconFileName: ""
    });
    const [validated, setValidated] = useState(false);

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            //event.stopImmediatePropagation();//????
        } else {
            setValidated(true);
            event.preventDefault();
            onSubmit();
        }
    };

    const onSubmit = () => {
        //if (!validated)
        //    alert('invalid input');
        const url = "api/wallet";
        const data = {
            "name": wallet.name,
            "currency": wallet.currency.toUpperCase(),
            "initialAmount": wallet.initialAmount,
            "iconFileName": wallet.iconFileName
        };

        axios.post(url, data)
            .then(() => {
                onDataChanged();
                getWalletBalance({currency: wallet.currency, amount: wallet.initialAmount});
                onClose();
            });
    }

    function printStatusMessage() {
        if (wallet.name === "")
            return "Seems like there's nowhere to store your savings yet"
        if (wallet.currency === "")
            return "Will you please specify the currency for " + wallet.name + "?";
        if (wallet.initialAmount === 0)
            return "Your " + wallet.name + " wallet isn't going to be empty, or is it?";
        return "Your " + wallet.name + " is going to have " + wallet.initialAmount + " " + wallet.currency + " in it, right?";
    }

    if (!open) return null;

    return (
        <Modal show={open} onHide={onClose} backdrop="static" contentClassName="modal-container">
            <Modal.Header closeButton>
                <Modal.Title><big>Add new wallet</big></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form validated={validated} onSubmit={handleSubmit} /*noValidate*/>
                    <Row>
                        <Col xs={12} md={5}>
                            <Form.Group>
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Your new wallet"
                                    aria-label="Name of your new wallet"
                                    value={wallet.name} maxLength="255"
                                    onChange={e => {
                                        setWallet({ ...wallet, name: e.target.value })
                                    }}
                                    autoFocus
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
                                    value={wallet.currency} maxLength="3"
                                    onChange={e => {
                                        setWallet({ ...wallet, currency: e.target.value.toUpperCase() })
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
                                    value={wallet.initialAmount} min="0"
                                    onChange={e => {
                                        setWallet({ ...wallet, initialAmount: e.target.value })
                                    }}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <p className="pt-4"><big>{printStatusMessage()}</big></p>

                    <div className="modal-footer">
                        <Button variant="primary" size="lg" type="submit">
                            Add
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default AddWalletModal;