import { Placeholder } from "react-bootstrap";


export default function WalletsPlaceholder() {
    return (
        <section>
            <div>
                <h3>Wallets</h3>
            </div>


            <div className="wallets-placeholder mt-3">
                {
                    Array.from({ length: 3 }, (_, index) => (
                        <Placeholder bg="dark" as="div" animation="wave" className="wallet-placeholder" key={index} />
                    ))
                }
            </div>
        </section>
    )
}