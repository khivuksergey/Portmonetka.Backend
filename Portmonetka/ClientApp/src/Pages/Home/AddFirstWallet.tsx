import { MdAdd } from "react-icons/md";

interface IAddFirstWalletProps {
    onAddWallet: () => void
}

export default function AddFirstWallet({ onAddWallet } : IAddFirstWalletProps) {
    return (
        <div className="d-flex flex-column align-items-center mt-5">
            <h1 style={{ textAlign: "center" }}>
                Add your first wallet
            </h1>

            <button
                className="add-wallet add-wallet--big mt-2"
                onClick={onAddWallet}
            >
                <MdAdd />
            </button>
        </div>
    )
}