import { createContext } from "react";
import { IGlobalBalanceContext } from "../DataTypes";

const GlobalBalanceContext = createContext<IGlobalBalanceContext | null>(null!);

export default GlobalBalanceContext;