import { IconAdd } from "../../Common/Icons";

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
                type="button"
                className="button--add-wallet button--add-wallet--big mt-2"
                onClick={onAddWallet}
            >
                <IconAdd />
            </button>
        </div>
    )
}