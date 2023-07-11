import { Placeholder } from "react-bootstrap";


export default function BalancePlaceholder() {
    return (
        <section className="mb-4">
            <h3>Balance</h3>

            <div className="mt-3 d-flex gap-4">
                {
                    Array.from({ length: 3 }, (_, index) => (
                        <Placeholder bg="dark" as="div" animation="wave" className="balance-placeholder" key={index} />
                    ))
                }
            </div>
        </section>
    )
}