import { useContext } from "react";
import CurrencyToSign from "../../Utilities/CurrencyToSignConverter";
import GlobalBalanceContext from "../../Context/GlobalBalanceContext";
import { IGlobalBalance } from "../../DataTypes";
import { Container } from "react-bootstrap";

interface IBalance {
    currency: string
    sum: number
}

export default function Balance() {
    const globalBalanceContext = useContext(GlobalBalanceContext);

    let balances: IBalance[] = [];

    const calculate = () => {
        var _ = require("lodash");
        let result = _.groupBy(globalBalanceContext!.globalBalance, "currency");

        _.forEach(result,
            (value: IGlobalBalance[], key: string) =>
                balances = [...balances,
                {
                    currency: key,
                    sum: value.reduce((acc, cur) => acc + cur.amount, 0)
                }]
        );

        console.log('Global Balance in Balance.tsx: ', globalBalanceContext!.globalBalance);
    }

    calculate();

    return (
        <section>
            <Container>
                <div className="balance mt-4 d-flex justify-content-center flex-wrap">
                    {
                        balances.map(b =>
                            <h1 key={b.currency}>
                                {b.sum}{CurrencyToSign(b.currency)}
                            </h1>
                        )
                    }
                </div>
            </Container>
        </section>

    )
}