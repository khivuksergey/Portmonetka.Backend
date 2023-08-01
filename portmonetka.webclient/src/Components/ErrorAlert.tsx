import { Alert, Fade } from "react-bootstrap";

interface IErrorAlertProps {
    showError: boolean
    onClose: () => void
    error: string
}

export default function ErrorAlert({ showError, onClose, error }: IErrorAlertProps) {
    return (
        showError ?
            <Fade in={showError}>
                <div style={{ position: "fixed", right: "1rem", zIndex: 5 }}>
                    <Alert
                        variant="danger"
                        // closeVariant="white"
                        onClose={onClose}
                        transition={true}
                        dismissible
                    >
                        <Alert.Heading>
                            Oops! Something went wrong
                        </Alert.Heading>
                        {error}
                    </Alert>
                </div>
            </Fade>
            :
            null
    )
}