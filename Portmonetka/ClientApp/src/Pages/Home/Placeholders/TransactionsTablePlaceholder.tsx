import { Placeholder } from "react-bootstrap";

export default function TransactionsTablePlaceholder() {
    return (
        <div style={{ paddingTop: "8px", paddingBottom: "13px" }}>
            {Array.from({ length: 2 }, (_, index) => (
                <div key={index} className="d-flex gap-3 mb-3">
                    <Placeholder bg="dark" as="div" animation="wave" style={{ height: "32px", width: "150px" }} />
                    <Placeholder bg="dark" as="div" animation="wave" style={{ height: "32px", width: "370px" }} />
                    <Placeholder bg="dark" as="div" animation="wave" style={{ height: "32px", width: "200px" }} />
                    <Placeholder bg="dark" as="div" animation="wave" style={{ height: "32px", width: "200px" }} />
                </div>
            ))}
            <div className="d-flex gap-3 mb-3">
                <Placeholder bg="dark" as="div" animation="wave" style={{ height: "28px", width: "150px" }} />
                <Placeholder bg="dark" as="div" animation="wave" style={{ height: "28px", width: "370px" }} />
                <Placeholder bg="dark" as="div" animation="wave" style={{ height: "28px", width: "200px" }} />
                <Placeholder bg="dark" as="div" animation="wave" style={{ height: "28px", width: "200px" }} />
            </div>
            <div className="d-flex gap-3">
                <Placeholder bg="dark" as="div" animation="wave" style={{ height: "28px", width: "150px" }} />
                <Placeholder bg="dark" as="div" animation="wave" style={{ height: "28px", width: "370px" }} />
                <Placeholder bg="dark" as="div" animation="wave" style={{ height: "28px", width: "200px" }} />
                <Placeholder bg="dark" as="div" animation="wave" style={{ height: "28px", width: "200px" }} />
            </div>
        </div>
    )
}