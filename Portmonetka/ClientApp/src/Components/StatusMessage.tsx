import { IWalletProps } from "DataTypes";
import AddWalletStatusMessage from "../Utilities/AddWalletStatusMessage";


interface StatusMessageProps {
    wallet: IWalletProps
}

export default function StatusMessage({ wallet }: StatusMessageProps) {
    return (
        <p className="pt-4 hyphenate" style={{color: "lightgrey"} } >
            {AddWalletStatusMessage(wallet)}
        </p>
    )
}