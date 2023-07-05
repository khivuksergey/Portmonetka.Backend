import getSymbolFromCurrency from "currency-symbol-map";
import { GiCat } from "react-icons/gi";

export default function CurrencyToSign(currency: string): React.ReactNode {
    const incorrectValues = ["лв", ""];

    switch (currency.toUpperCase()) {
        case "KUS":
            return <i><GiCat className="kusya" /></i>
        case "YAS":
            return <i><GiCat className="yasya" /></i>
        default:
            const symbol = getSymbolFromCurrency(currency);
            return incorrectValues.includes(symbol ?? "") ? currency.toUpperCase() : symbol;
    }
}