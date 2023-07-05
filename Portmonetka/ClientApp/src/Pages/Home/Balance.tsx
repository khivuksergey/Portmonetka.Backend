import { useContext } from "react";
import GlobalBalanceContext from "../../Context/GlobalBalanceContext";
import { IGlobalBalance, ICurrencyBalance } from "../../DataTypes";
import BalanceBubble from "../../Components/BalanceBubble";

import { Swiper, SwiperSlide, SwiperProps } from "swiper/react";
import { Scrollbar, Pagination, Mousewheel } from "swiper/modules";
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/scrollbar';
import 'swiper/css/pagination';

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
                    income: parseFloat((Math.random() * 20000).toFixed(0)),
                    outcome: -parseFloat((Math.random() * 20000).toFixed(0)),
                    incomeTrend: parseFloat(((Math.random() * 10) - 5).toFixed(1)),
                    outcomeTrend: parseFloat(((Math.random() * 10) - 5).toFixed(1))
                }]
        );
    }

    calculate();

    const swiperParams: any = {
        scrollbar: { hide: true },
        slidesPerView: "auto",
        //spaceBetween: 20,
        mousewheel: true,
        modules: [Scrollbar, Mousewheel, Pagination]
    };

    return (
        <section className="mb-4">
            <h3>Balance</h3>

            {/*<div id="balances" className="balances mt-3" style={{ minHeight: "90px" }}>*/}
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
            {/*</div>*/}
        </section >
    )
}


//<div key={balance.currency}
//    style={{
//        background: "lightblue",
//        color: "black",
//        border: "1px solid white",
//        flexShrink: "0",
//        //maxWidth: "280px",
//        maxWidth: "240px"
//    }}>
//    Balance currency is {balance.currency}, balance is {balance.sum}
//</div>