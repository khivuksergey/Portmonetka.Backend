import { useContext } from "react";
import CurrencyToSign from "../../Utilities/CurrencyToSignConverter";
import MoneyToLocaleString from "../../Utilities/MoneyToLocaleString";
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
    }

    calculate();

    return (
        <section>
            <Container>
                <div className="balance mt-4 d-flex justify-content-center flex-wrap">
                    {
                        balances
                            .sort((a,b) => a.currency < b.currency ? -1 : 1)
                            .map(b =>
                            <h1 key={b.currency}>
                                {MoneyToLocaleString(b.sum)}&nbsp;{CurrencyToSign(b.currency)}
                            </h1>
                        )
                    }
                </div>
            </Container>
        </section>
    )
}