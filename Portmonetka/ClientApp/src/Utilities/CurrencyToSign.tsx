import getSymbolFromCurrency from "currency-symbol-map";
import { IconCat } from "../Common/Icons";

export default function CurrencyToSign(currency: string): React.ReactNode {
    const incorrectValues = ["лв", ""];

    switch (currency.toUpperCase()) {
        case "KUS":
            return <i><IconCat className="kusya" /></i>
        case "YAS":
            return <i><IconCat className="yasya" /></i>
        default:
            const symbol = getSymbolFromCurrency(currency);
            return incorrectValues.includes(symbol ?? "") ? currency.toUpperCase() : symbol;
    }
}