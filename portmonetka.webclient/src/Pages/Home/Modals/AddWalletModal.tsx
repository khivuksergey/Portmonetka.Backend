import { IWallet, IWalletProps } from "../../../Common/DataTypes";
import { Modal, ModalFooter } from "../../../Components";
import { WalletPropertiesForm } from "../Components";

interface AddWalletModalProps {
    show: boolean
    onClose: () => void
    onAddWallet: (wallet: IWallet) => Promise<void>
}

const AddWalletModal = ({ show, onClose, onAddWallet }: AddWalletModalProps) => {

    // #region Initializations

    const wallet: IWalletProps = {
        name: "",
        currency: "",
        initialAmount: ""
    }

    // #endregion

    // #region Data change handlers

    const handleSubmit = (wallet: IWalletProps) => {
        const newWallet: IWallet = {
            id: 0,
            name: wallet.name.trim(),
            currency: wallet.currency.toUpperCase(),
            initialAmount: Number(wallet.initialAmount)
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
                <ModalFooter onReset={onClose} submitText="Add" />
            </WalletPropertiesForm>
        </Modal>
    )
}

export default AddWalletModal;