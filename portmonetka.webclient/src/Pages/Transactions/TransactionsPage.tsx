import { useEffect, useState } from "react";
import { ErrorAlert } from "../../Components";
import NoConnection from "../Layout/NoConnection";
import TransactionTemplates from "./TransactionTemplates";

export default function TransactionsPage() {
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [showNoConnection, setShowNoConnection] = useState(false);

    useEffect(() => {
        if (errorMessage === "")
            return;
            
        const isConnectionError = errorMessage.includes("Error occurred while trying to proxy");

        setShowError(!isConnectionError);
        setShowNoConnection(isConnectionError);
    }, [errorMessage])

    const onError = (message: string) => {
        setErrorMessage(message);
    }

    return (
        <>
            <ErrorAlert showError={showError} onClose={() => setShowError(false)} error={errorMessage} />

            {showNoConnection ?
                <NoConnection />
                :
                <TransactionTemplates onError={onError} />
            }
        </>
    )
}