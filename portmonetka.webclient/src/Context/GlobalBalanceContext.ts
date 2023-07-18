import { createContext } from "react";
import { IGlobalBalanceContext } from "../Common/DataTypes";

const GlobalBalanceContext = createContext<IGlobalBalanceContext | null>(null!);

export default GlobalBalanceContext;