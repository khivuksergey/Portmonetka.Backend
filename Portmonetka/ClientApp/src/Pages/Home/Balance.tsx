import { useContext } from "react";
import GlobalBalanceContext from "../../Context/GlobalBalanceContext";
import { IGlobalBalance, ICurrencyBalance } from "../../DataTypes";
import BalanceBubble from "../../Components/BalanceBubble";
import { Container } from "react-bootstrap";



export default function Balance() {
    const globalBalanceContext = useContext(GlobalBalanceContext);

    let balances: ICurrencyBalance[] = [];

    const calculate = () => {
        var _ = require("lodash");
        let result = _.groupBy(globalBalanceContext!.globalBalance, "currency");

        _.forEach(result,
            (value: IGlobalBalance[], key: string) =>
                balances = [...balances,
                {
                    currency: key,
                    sum: value.reduce((acc, cur) => acc + cur.amount, 0),
                    income: 1599,
                    outcome: -1256,
                    incomeTrend: -3.7,
                    outcomeTrend: -2.3
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
                            .sort((a, b) => a.currency < b.currency ? -1 : 1)
                            .map(balance =>
                                <BalanceBubble key={balance.currency} balance={balance} />
                            )
                    }
                </div>
            </Container>
        </section>
    )
}