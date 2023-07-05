//import { useState } from "react";
//import { Formik, FormikErrors } from "formik";
//import * as yup from "yup";
//import { Form, Row, Col } from "react-bootstrap";
import Modal from "../../Components/Modal";
import StatusMessage from "../../Components/StatusMessage";
import { IWallet, IWalletProps } from "../../DataTypes";
import ModalFooter from "../../Components/ModalFooter";
import WalletPropertiesForm from "./WalletPropertiesForm";

interface AddWalletModalProps {
    show: boolean
    onClose: () => void
    onAddWallet: (wallet: IWallet) => Promise<void>
}

//interface IAddWallet {
//    name: string,
//    currency: string,
//    initialAmount: string,
//    iconFileName: string
//}

const AddWalletModal = ({ show, onClose, onAddWallet }: AddWalletModalProps) => {

    // #region Initializations

    //const validationSchema = yup.object().shape(
    //    {
    //        name: yup.string().max(128, "Maximum 128 characters").required("Name is required"),
    //        currency: yup.string().length(3, "e.g. USD").required("Currency is required"),
    //        initialAmount: yup.number().min(0, "Minimum 0").required("Initial amount is required"),
    //        iconFileName: yup.string()//.required("Icon is required")
    //    }
    //);

    const wallet: IWalletProps = {
        name: "",
        currency: "",
        initialAmount: ""
    }

    // #endregion

    // #region Data change handlers

    const handleSubmit = (wallet: IWalletProps) => {
        const newWallet: IWallet = {
            name: wallet.name.trim(),
            currency: wallet.currency.toUpperCase(),
            initialAmount: Number(wallet.initialAmount),
            /*iconFileName: wallet.iconFileName*/
        };
        onAddWallet(newWallet);
        onClose();
    };

    // #endregion

    const modalTitle = <big>Add new wallet</big>

    if (!show) return null;

    return (
        <Modal title={modalTitle} show={show} onClose={onClose} contentClassName="modal-container">
            <WalletPropertiesForm
                initialValues={wallet}
                handleSubmit={(wallet) => handleSubmit(wallet)}
            >
                {/*<StatusMessage wallet={wallet} />*/}
                <ModalFooter onReset={onClose} submitText="Add" />
            </WalletPropertiesForm>
        </Modal>
    )
}

export default AddWalletModal;