import { useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import Modal from "../../Components/Modal";
import SubmitButton from "../../Components/SubmitButton";
import StatusMessage from "../../Components/StatusMessage";
import { IWallet } from "../../DataTypes";

interface AddWalletModalProps {
    show: boolean
    onClose: () => void
    onAddWallet: (wallet: IWallet) => Promise<void>
}

enum WalletPropType {
    Name,
    Currency,
    InitialAmount
}

let newWallet: IWallet = {
    name: "",
    currency: "",
    initialAmount: undefined,
    iconFileName: ""
}

const AddWalletModal = ({ show, onClose, onAddWallet }: AddWalletModalProps) => {
    const [wallet, setWallet] = useState<IWallet>(newWallet);
    const [validated, setValidated] = useState(false);

    const handleChange = (field: WalletPropType, e: React.ChangeEvent<HTMLInputElement>) => {
        switch (field) {
            case WalletPropType.Name:
                setWallet({ ...wallet, name: e.target.value });
                break;
            case WalletPropType.Currency:
                setWallet({ ...wallet, currency: e.target.value.toUpperCase() })
                break;
            case WalletPropType.InitialAmount:
                let initialAmount = e.target.value;
                if (initialAmount[0] === "0" && initialAmount.length > 1)
                    initialAmount = initialAmount.substring(1);
                setWallet({ ...wallet, initialAmount: Number(initialAmount) })
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
        } else {
            setValidated(true);
            onSubmit();
        }
    };

    const onSubmit = () => {
        newWallet = {
            name: wallet.name.trim(),
            currency: wallet.currency.toUpperCase(),
            initialAmount: wallet.initialAmount,
            iconFileName: wallet.iconFileName
        };
        onAddWallet(newWallet);//TO-DO
        onClose();
    }

    const modalTitle = <big>Add new wallet</big>

    if (!show) return null;

    return (
        <Modal title={modalTitle} show={show} onClose={onClose} contentClassName="modal-container">
            <Form validated={validated} onSubmit={handleSubmit} noValidate>
                <Row>
                    <Col xs={12} md={5}>
                        <Form.Group>
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Your new wallet"
                                aria-label="Wallet name"
                                value={wallet.name} maxLength={128}
                                onChange={e => {
                                    handleChange(WalletPropType.Name, e as any);
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
                                aria-label="Wallet currency"
                                value={wallet.currency} maxLength={3}
                                onChange={e => {
                                    handleChange(WalletPropType.Currency, e as any);
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
                                value={wallet.initialAmount} min={0}
                                onChange={e => {
                                    handleChange(WalletPropType.InitialAmount, e as any);
                                }}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <StatusMessage wallet={wallet} />

                <div className="modal-footer">
                    <SubmitButton text="Add" />
                </div>
            </Form>
        </Modal>
    )
}

export default AddWalletModal;