import { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import Modal from "../../Components/Modal";
import StatusMessage from "../../Components/StatusMessage";
import MoneyToLocaleString from "../../Utilities/MoneyToLocaleString";
import { IWallet } from "../../DataTypes";

interface AddWalletModalProps {
    show: boolean
    onClose: () => void
    onAddWallet: (wallet: IWallet) => Promise<void>
}

enum WalletPropsType {
    Name,
    Currency,
    InitialAmount
}

const AddWalletModal = ({ show, onClose, onAddWallet }: AddWalletModalProps) => {
    const [wallet, setWallet] = useState({
        name: "",
        currency: "",
        initialAmount: "",
        iconFileName: ""
    });

    const [validated, setValidated] = useState(false);

    const handleChange = (field: WalletPropsType, e: React.ChangeEvent<HTMLInputElement>) => {
        switch (field) {
            case WalletPropsType.Name:
                setWallet({ ...wallet, name: e.target.value });
                break;
            case WalletPropsType.Currency:
                setWallet({ ...wallet, currency: e.target.value.toUpperCase() })
                break;
            case WalletPropsType.InitialAmount:
                let initialAmount = e.target.value;
                if (initialAmount[0] === "0" && initialAmount.length > 1)
                    initialAmount = initialAmount.substring(1);
                setWallet({ ...wallet, initialAmount: initialAmount })
                break;
            default:
                console.log("Invalid wallet property type");
                break;
        }
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
            setValidated(false);
        } else {
            setValidated(true);
            onSubmit();
        }
    };

    const onSubmit = () => {
        let newWallet: IWallet = {
            name: wallet.name.trim(),
            currency: wallet.currency.toUpperCase(),
            initialAmount: Number(wallet.initialAmount),
            iconFileName: wallet.iconFileName
        };
        onAddWallet(newWallet);
        onClose();
    }

    const modalTitle = <big>Add new wallet</big>

    if (!show) return null;

    return (
        <Modal title={modalTitle} show={show} onClose={onClose} contentClassName="modal-container">
            <Form validated={validated} onSubmit={handleSubmit}>
                <Row>
                    <Col xs={12} md={5}>
                        <Form.Group>
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                className="form-control--dark"
                                placeholder="My wallet"
                                value={wallet.name} maxLength={128}
                                onChange={e => {
                                    handleChange(WalletPropsType.Name, e as any);
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
                                className="form-control--dark"
                                placeholder="USD"
                                value={wallet.currency} minLength={3} maxLength={3}
                                onChange={e => {
                                    handleChange(WalletPropsType.Currency, e as any);
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
                                className="form-control--dark"
                                step="any"
                                placeholder="10000"
                                value={wallet.initialAmount ?? ''} min={0}
                                onChange={e => {
                                    handleChange(WalletPropsType.InitialAmount, e as any);
                                }}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <StatusMessage wallet={wallet as unknown as IWallet} />

                <div className="modal-footer">
                    <Button type="reset" className="btn-dark" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" className="ok-btn">
                        Add
                    </Button>
                </div>
            </Form>
        </Modal>
    )
}

export default AddWalletModal;