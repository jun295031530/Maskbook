import { useCallback } from 'react'
import { isLessThan, isZero } from '@masknet/web3-shared-base'
import type { NetworkPluginID } from '@masknet/shared-base'
import { type ChainId, ContractTransaction, type GasConfig } from '@masknet/web3-shared-evm'
import { useChainContext, useWeb3Connection } from '@masknet/web3-hooks-base'
import { useNativeTokenWrapperContract } from './useWrappedEtherContract.js'

export function useNativeTokenWrapperCallback(chainId?: ChainId) {
    const { account } = useChainContext<NetworkPluginID.PLUGIN_EVM>()
    const wrapperContract = useNativeTokenWrapperContract(chainId)
    const connection = useWeb3Connection()

    const wrapCallback = useCallback(
        async (amount: string, gasConfig?: GasConfig) => {
            if (!connection || !wrapperContract || !amount) {
                return
            }

            // error: invalid deposit amount
            if (isZero(amount)) return

            // estimate gas and compose transaction
            const tx = await new ContractTransaction(wrapperContract).fillAll(wrapperContract.methods.deposit(), {
                from: account,
                value: amount,
                ...gasConfig,
            })

            // send transaction and wait for hash
            const hash = await connection.sendTransaction(tx, { chainId, overrides: { ...gasConfig } })

            const receipt = await connection.getTransactionReceipt(hash)

            return receipt?.transactionHash
        },
        [account, wrapperContract, chainId],
    )

    const unwrapCallback = useCallback(
        async (all = true, amount = '0', gasConfig?: GasConfig) => {
            if (!connection || !wrapperContract || !amount) {
                return
            }

            // read balance
            const wethBalance = await wrapperContract.methods.balanceOf(account).call()

            // error: invalid withdraw amount
            if (all === false && isZero(amount)) {
                return
            }

            // error: insufficient weth balance
            if (all === false && isLessThan(wethBalance, amount)) {
                return
            }

            // estimate gas and compose transaction
            const tx = await new ContractTransaction(wrapperContract).fillAll(
                wrapperContract.methods.withdraw(all ? wethBalance : amount),
                {
                    from: account,
                    ...gasConfig,
                },
            )

            // send transaction and wait for hash

            const hash = await connection.sendTransaction(tx, { chainId, overrides: { ...gasConfig } })
            const receipt = await connection.getTransactionReceipt(hash)

            return receipt?.transactionHash
        },
        [account, wrapperContract, chainId],
    )

    return [wrapCallback, unwrapCallback] as const
}
