import { toHex } from 'web3-utils'
import type { Wallet } from '@masknet/shared-base'
import {
    type ConnectionContext,
    EthereumMethodType,
    type Middleware,
    ProviderType,
    isValidAddress,
} from '@masknet/web3-shared-evm'
import { type BaseContractWalletProvider, EVM_Providers } from '@masknet/web3-providers'

export class MaskWallet implements Middleware<ConnectionContext> {
    private get walletProvider() {
        return EVM_Providers[ProviderType.MaskWallet]
    }

    async fn(context: ConnectionContext, next: () => Promise<void>) {
        if (!context.writeable) {
            await next()
            return
        }

        const account = ''

        const provider = EVM_Providers.Maskbook as BaseContractWalletProvider

        switch (context.request.method) {
            case EthereumMethodType.ETH_CHAIN_ID:
                context.write(toHex(provider.hostedChainId))
                break
            case EthereumMethodType.ETH_ACCOUNTS:
                context.write([provider.hostedAccount])
                break
            case EthereumMethodType.MASK_WALLETS:
                try {
                    context.write(this.walletProvider.subscription.wallets.getCurrentValue())
                } catch (error) {
                    context.abort(context)
                }
                break
            case EthereumMethodType.MASK_ADD_WALLET:
                try {
                    if (!context.wallet) throw new Error('No wallet to be added.')
                    await this.walletProvider.addWallet(context.wallet)
                    context.write()
                } catch (error) {
                    context.abort(context)
                }
                break
            case EthereumMethodType.MASK_ADD_OR_UPDATE_WALLET:
                try {
                    if (!context.wallet) throw new Error('No wallet to be added.')
                    await this.walletProvider.updateOrAddWallet(context.wallet)
                    context.write()
                } catch (error) {
                    context.abort(context)
                }
                break
            case EthereumMethodType.MASK_UPDATE_WALLET:
                try {
                    const [address, updates] = context.requestArguments.params as [string, Wallet]
                    if (!isValidAddress(address)) throw new Error('Not a valid wallet address.')
                    await this.walletProvider.updateWallet(address, updates)
                    context.write()
                } catch (error) {
                    context.abort(context)
                }
                break
            case EthereumMethodType.MASK_RENAME_WALLET:
                try {
                    const [address, name] = context.requestArguments.params as [string, string]
                    if (!isValidAddress(address)) throw new Error('Not a valid wallet address.')
                    await this.walletProvider.renameWallet(address, name)
                    context.write()
                } catch (error) {
                    context.abort(context)
                }
                break
            case EthereumMethodType.MASK_REMOVE_WALLET:
                try {
                    const [address, password] = context.requestArguments.params as [string, string | undefined]
                    if (!isValidAddress(address)) throw new Error('Not a valid wallet address.')
                    await this.walletProvider.removeWallet(address, password)
                    context.write()
                } catch (error) {
                    context.abort(context)
                }
                break
            case EthereumMethodType.MASK_UPDATE_WALLETS:
                try {
                    const wallets = context.requestArguments.params as Wallet[]
                    if (wallets.some((x) => !isValidAddress(x.address))) throw new Error('Not a valid wallet address.')
                    await this.walletProvider.updateWallets(wallets)
                    context.write()
                } catch (error) {
                    context.abort(context)
                }
                break
            case EthereumMethodType.MASK_REMOVE_WALLETS:
                try {
                    const wallets = context.requestArguments.params as Wallet[]
                    if (wallets.some((x) => !isValidAddress(x.address))) throw new Error('Not a valid wallet address.')
                    await this.walletProvider.removeWallets(wallets)
                    context.write()
                } catch (error) {
                    context.abort(context)
                }
                break
            default:
                break
        }
        await next()
    }
}
