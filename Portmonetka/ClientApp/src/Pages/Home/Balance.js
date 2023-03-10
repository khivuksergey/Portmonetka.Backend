import { useContext } from "react";
import currencyToSign from "../../Utilities/CurrencyToSignConverter";
import GlobalBalanceContext from "../../Context/GlobalBalanceContext";
import Container from "react-bootstrap/Container";

//incorrect behaviour when adding or removing a wallet
function Balance() {
    const { walletsBalance } = useContext(GlobalBalanceContext);
    let balances = [];
    var _ = require("lodash");

    let result = _.groupBy(walletsBalance, "currency");

    _.forEach(result,
        (value, key) =>
            balances = [...balances,
            {
                currency: key,
                sum: value.reduce((acc, cur) => acc + cur.amount, 0)
            }]
    );

    return (
        <section>
            <Container>
                <div className="balance mt-4 d-flex justify-content-center flex-wrap">
                    {
                        balances.map(b =>
                            <h1 key={b.currency}>
                                {b.sum}{currencyToSign(b.currency)}
                            </h1>
                        )
                    }
                </div>
            </Container>
        </section>

    )
}

export default Balance;