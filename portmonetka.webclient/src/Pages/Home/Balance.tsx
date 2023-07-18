import { useContext } from "react";
import GlobalBalanceContext from "../../Context/GlobalBalanceContext";
import { IGlobalBalance, ICurrencyBalance } from "../../Common/DataTypes";
import { BalanceBubble } from "./Components";

import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar, Pagination, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/scrollbar";
import "swiper/css/pagination";

export default function Balance() {
    const globalBalanceContext = useContext(GlobalBalanceContext);

    let balances: ICurrencyBalance[] = [];

    interface IFakeStats {
        income: number
        outcome: number
        incomeTrend: number
        outcomeTrend: number
    }

    const generateFakeStats = (): IFakeStats => {
        return {
            income: parseFloat((Math.random() * 20000).toFixed(0)),
            outcome: -parseFloat((Math.random() * 10000).toFixed(0)),
            incomeTrend: parseFloat(((Math.random() * 10) - 5).toFixed(1)),
            outcomeTrend: parseFloat(((Math.random() * 10) - 5).toFixed(1))
        }
    }

    const calculate = () => {
        var _ = require("lodash");
        let result = _.groupBy(globalBalanceContext!.globalBalance, "currency");

        _.forEach(result,
            (value: IGlobalBalance[], key: string) => {
                const stats = generateFakeStats();

                balances = [...balances,
                {
                    currency: key,
                    sum: value.reduce((acc, cur) => acc + cur.amount, 0),
                    income: stats?.income ?? 0,
                    outcome: stats?.outcome ?? 0,
                    incomeTrend: stats?.incomeTrend ?? 0,
                    outcomeTrend: stats?.outcomeTrend ?? 0,
                }]
            }
        );
    }

    calculate();

    const swiperParams: any = {
        scrollbar: { hide: true },
        slidesPerView: "auto",
        mousewheel: true,
        modules: [Scrollbar, Mousewheel, Pagination]
    };

    return (
        <section className="mb-4">
            <h3>Balance</h3>

            <Swiper {...swiperParams} className="balances mt-3">
                {
                    balances
                        .sort((a, b) => a.currency < b.currency ? -1 : 1)
                        .map(balance =>
                            <SwiperSlide key={balance.currency}>
                                <BalanceBubble balance={balance} key={balance.currency} />
                            </SwiperSlide>
                        )
                }
            </Swiper>

        </section >
    )
}