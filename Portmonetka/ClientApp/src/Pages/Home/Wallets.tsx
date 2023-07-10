import { IWallet } from "../../DataTypes";
import Wallet from "./Components/Wallet";
import { MdAdd } from "react-icons/md";

interface IWalletsProps {
    wallets: IWallet[]
    onAddWallet: () => void
    onChangeWallet: (wallet: IWallet) => Promise<void>
    onDeleteWallet: (id: number, force?: boolean) => Promise<boolean>
}

export default function Wallets({wallets, onAddWallet, onChangeWallet, onDeleteWallet } : IWalletsProps) {
    return (
        <section>
            <div className="wallets-header">
                <h3>Wallets</h3>

                <button className="add-wallet"
                    onClick={onAddWallet}
                >
                    <MdAdd fill="var(--placeholder-gray)" />
                </button>
            </div>


            <div id="wallets" className="wallets mt-3">
                {
                    wallets && wallets.length > 0 ?
                        wallets.map((wallet) => {
                            return <Wallet
                                key={wallet.id}
                                wallet={wallet}
                                onDeleteWallet={onDeleteWallet}
                                onChangeWallet={onChangeWallet} />
                        })
                        : null
                }

            </div>
        </section>
    )
}