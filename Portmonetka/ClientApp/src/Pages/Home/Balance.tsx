import { useContext } from "react";
import GlobalBalanceContext from "../../Context/GlobalBalanceContext";
import { IGlobalBalance, ICurrencyBalance } from "../../DataTypes";
import BalanceBubble from "../../Components/BalanceBubble";


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
                    income: 15399,
                    outcome: -156.65,
                    incomeTrend: -1.5,
                    outcomeTrend: -2.3
                }]
        );
    }

    calculate();

    return (
        <section className="mb-4">
            <h3>Balance</h3>

            <div id="balances" className="mt-3">
                {
                    balances
                        .sort((a, b) => a.currency < b.currency ? -1 : 1)
                        .map(balance =>
                            <BalanceBubble key={balance.currency} balance={balance} />
                        )
                }
            </div>
        </section>
    )
}