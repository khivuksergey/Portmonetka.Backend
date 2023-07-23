import { Placeholder } from "react-bootstrap";

export default function LatestTransactionsPreviewPlaceholder() {
    return (
        <div className="mt-2">
            {
                Array.from({ length: 8 }, (_, index) => (
                    <div key={index} className="d-flex gap-3 mb-3">
                        <Placeholder bg="dark" as="div" animation="wave" style={{ height: "1.5rem", width: "8rem" }} />
                        <Placeholder bg="dark" as="div" animation="wave" style={{ height: "1.5rem", width: "100%" }} />
                        <Placeholder bg="dark" as="div" animation="wave" style={{ height: "1.5rem", width: "10rem" }} />
                    </div>
                ))
            }
            <div className="transactions-preview-blur"></div>
        </div>
    )
}