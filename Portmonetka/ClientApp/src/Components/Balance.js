import { GiCat } from 'react-icons/gi';
import getSymbolFromCurrency from 'currency-symbol-map';
import Container from 'react-bootstrap/Container';

function Balance({ globalBalance }) {
    let balances = [];
    var _ = require('lodash');

    let result = _.groupBy(globalBalance, 'currency');

    _.forEach(result,
        (value, key) =>
            balances = [...balances,
            {
                currency: key,
                sum: value.reduce((acc, cur) => acc + cur.amount, 0)
            }]
    );

    function currencyToSign(currency) {
        if (currency.toUpperCase() === 'KUS') {
            return <i><GiCat className="kusya"/></i>
        } else {
            return getSymbolFromCurrency(currency);
        }
    }

    return (
        <section>
            <Container>
                <div className="balance mt-2 mt-sm-4 d-flex justify-content-center flex-wrap">
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