import { IWallet } from "DataTypes";
import AddWalletStatusMessage from "../Utilities/AddWalletStatusMessage";


interface StatusMessageProps {
    wallet: IWallet
}

export default function StatusMessage({ wallet }: StatusMessageProps) {
    return (
        <p className="pt-4" style={{color: "lightgrey"} } >
            <big>{AddWalletStatusMessage(wallet)}</big>
        </p>
    )
}