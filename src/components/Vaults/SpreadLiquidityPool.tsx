import { useConnectModal } from "@rainbow-me/rainbowkit";
import { BigNumber } from "ethers";
import { useState } from "react";
import { DebounceInput } from "react-debounce-input";
import { useAccount } from "wagmi";
import { useSpreadLiquidityPoolContext } from "../../context/SpreadLiquidityPoolContext";
import { useLPUser } from "../../queries/otus/user";
import { formatUSD, fromBigNumber, toBN } from "../../utils/formatters/numbers";

import { WalletConnect } from "../Builder/StrikeTrade/Common/WalletConnect";
import { Spinner } from "../UI/Components/Spinner";
import SUSDIcon from "../UI/Icons/Color/SUSD";
import { useChainContext } from "../../context/ChainContext";
import { Button } from "../UI/Components/Button";

const SpreadLiquidityPool = () => {
	const [open, setOpen] = useState(false);

	const { address } = useAccount();
	const { liquidityPool, isLoading, decimals } = useSpreadLiquidityPoolContext();

	const { isLoading: isUserLPLoading, data: lpUserData } = useLPUser(liquidityPool?.id, address);

	const userDeposit =
		lpUserData &&
		lpUserData.lpusers.length > 0 &&
		lpUserData.lpusers[0] &&
		lpUserData.lpusers[0].lpTokenBalance;

	if (isLoading) {
		return <Spinner />;
	}

	return liquidityPool ? (
		<>
			<div className="dark:shadow-black bg-white shadow-md shadow-zinc-200 rounded-xl dark:bg-zinc-900 ">
				<div key={liquidityPool.id} className="border-b dark:border-zinc-800 border-zinc-100">
					<div className="p-4">
						<div className="flex">
							<div>
								<div className="bg-emerald-500 inline-block rounded-full dark:shadow-black shadow-zinc-200">
									<SUSDIcon />
								</div>
							</div>

							<div className="ml-4">
								<h2 className="text-sm font-semibold">Spread Liquidity Pool</h2>
								<h3 className="text-xxs dark:text-zinc-300 pt-1">
									Provide liquidity and earn fees from traders.
								</h3>
							</div>
						</div>
					</div>
				</div>

				<div className="overflow-hidden border-b dark:border-zinc-800 border-zinc-100">
					<div className="p-4">
						<div className="flex gap-14">
							<div className="block">
								<div className="font-light text-xxs dark:text-zinc-400">TVL</div>

								<div className="font-semibold text-sm uppercase dark:text-zinc-200 mt-2">
									<strong>
										{liquidityPool.quoteBalance
											? formatUSD(fromBigNumber(liquidityPool.quoteBalance))
											: "$0"}
									</strong>
								</div>
							</div>

							<div className="block">
								<div className="font-light text-xxs dark:text-zinc-400">30D Fees</div>

								<div className="font-semibold text-sm uppercase dark:text-zinc-200 mt-2">
									<strong>
										{liquidityPool.feesCollected
											? formatUSD(fromBigNumber(liquidityPool.feesCollected))
											: "$0"}
									</strong>
								</div>
							</div>

							<div className="block">
								<div className="font-light text-xxs dark:text-zinc-400">Open Interest</div>

								<div className="font-semibold text-sm uppercase dark:text-zinc-200 mt-2">
									<strong>
										{liquidityPool.lockedCollateral
											? formatUSD(fromBigNumber(liquidityPool.lockedCollateral))
											: "$0"}
									</strong>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="border-b dark:border-zinc-800 border-zinc-100">
					<div className="p-4 py-8">
						<div className="flex justify-between items-center">
							<div>
								<div className="font-light text-xxs dark:text-zinc-400">Your Liquidity</div>

								<div className="font-semibold text-sm uppercase dark:text-zinc-200 mt-2">
									<strong>{userDeposit && formatUSD(fromBigNumber(userDeposit))}</strong>
								</div>
							</div>

							<div className="dark:bg-zinc-800 cursor-pointer bg-zinc-100 hover:dark:bg-zinc-400 rounded-full px-12 py-2 hover:bg-zinc-700 dark:text-white text-zinc-900 hover:text-zinc-100">
								<div className="text-xs items-center">History</div>
							</div>
						</div>
					</div>
				</div>

				{!open ? (
					<div className="border-b dark:border-zinc-800 border-zinc-100">
						<div className="p-4 py-6">
							<div
								onClick={() => setOpen(true)}
								className="cursor-pointer bg-gradient-to-t dark:from-emerald-700 dark:to-emerald-500 from-emerald-500  to-emerald-400 rounded-full p-4 w-full font-semibold hover:text-emerald-100 text-zinc-900 py-2 text-center"
							>
								Deposit
							</div>
						</div>
					</div>
				) : (
					<LiquidityPoolActions />
				)}

				<div className="p-4">
					<div className="flex flex-wrap justify-between py-2">
						<div className="text-xxs font-light dark:text-white">Total Deposits</div>
						<div className="font-sans text-xxs font-normal dark:text-white">
							{liquidityPool.freeCollateral && liquidityPool.lockedCollateral
								? formatUSD(
										fromBigNumber(liquidityPool.freeCollateral) +
											fromBigNumber(liquidityPool.lockedCollateral)
								  )
								: "$0"}
						</div>
					</div>
					<div className="rounded-xs h-3 w-full dark:bg-zinc-800 bg-zinc-200">
						{" "}
						{liquidityPool.freeCollateral && liquidityPool.lockedCollateral && (
							<div
								className={`progress-bar h-3 bg-emerald-500`}
								style={{
									width: percentWidth(
										liquidityPool.freeCollateral,
										liquidityPool.lockedCollateral,
										liquidityPool.cap
									),
								}}
							></div>
						)}
					</div>
					<div className="flex flex-wrap justify-between py-2">
						<div className="text-xxs font-light dark:text-white">Maximum Capacity</div>
						<div className="font-sans text-xxs font-normal dark:text-white">
							{formatUSD(fromBigNumber(liquidityPool.cap))}
						</div>
					</div>
				</div>
			</div>
		</>
	) : (
		<div className="cursor-pointer rounded-sm border dark:border-zinc-800 border-zinc-100 shadow-lg shadow-emerald-900">
			<div className="border-b dark:border-zinc-800 border-zinc-100">
				<div className="p-4">
					<div className="flex">
						<div>
							<div className="dark:bg-emerald-500 inline-block rounded-full dark:shadow-black shadow-zinc-200">
								<SUSDIcon />
							</div>
						</div>

						<div className="ml-4">
							<h2 className="text-sm font-semibold">Spread Liquidity Pool</h2>
							<h3 className="text-xxs dark:text-zinc-300 pt-1">
								Currently not available on this network.
							</h3>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const percentWidth = (
	freeCollateral: BigNumber,
	lockedCollateral: BigNumber,
	vaultCap: BigNumber
): string => {
	const _freeCollateral = fromBigNumber(freeCollateral);
	const _lockedCollateral = fromBigNumber(lockedCollateral);
	const _totalCollateral = _freeCollateral + _lockedCollateral;
	const formatVaultCap = fromBigNumber(vaultCap);
	return `${(_totalCollateral / formatVaultCap) * 100}%`;
};

enum LPActionType {
	DEPOSIT,
	WITHDRAW,
}

const LiquidityPoolActions = () => {
	const {
		decimals,
		isTxLoading,
		isLoading,
		liquidityPool,
		userBalance,
		isApproveQuoteLoading,
		isDepositLoading,
		isWithdrawLoading,
		depositAmount,
		withdrawAmount,
		poolAllowance,
		lpBalance,
		setDepositAmount,
		setWithdrawAmount,
		deposit,
		withdraw,
		approveQuote,
	} = useSpreadLiquidityPoolContext();

	const { isConnected } = useAccount();

	const { selectedChain: chain } = useChainContext();

	const { openConnectModal } = useConnectModal();

	const [liquidityPoolActionType, setLiquidityPoolActionType] = useState(LPActionType.DEPOSIT);

	return (
		<div className="p-4">
			<div className="">
				<div className="flex justify-between">
					<div className="font-light py-2 text-sm dark:text-zinc-200 text-center">
						Withdrawal Fee
					</div>
					<div className="font-normal py-2 text-sm dark:text-zinc-200 text-center">0%</div>
				</div>
				<div className="flex justify-between">
					<div className="font-light py-2 text-sm dark:text-zinc-200 text-center">
						Withdrawal Delay
					</div>
					<div className="font-normal py-2 text-sm dark:text-zinc-200 text-center">0 Days</div>
				</div>
				<div className="flex justify-between">
					<div className="font-light py-2 text-sm dark:text-zinc-200 text-center">
						Deposit Delay
					</div>
					<div className="font-normal py-2 text-sm dark:text-zinc-200 text-center">0 Days</div>
				</div>
				<div className="flex justify-between">
					<div className="font-light py-2 text-sm dark:text-zinc-200 text-center">
						Minimum Deposit/Withdrawal
					</div>
					<div className="font-normal py-2 text-sm dark:text-zinc-200 text-center">
						{liquidityPool?.minDepositWithdraw &&
							formatUSD(fromBigNumber(liquidityPool.minDepositWithdraw))}
					</div>
				</div>
			</div>

			<div className="pt-4 ">
				<div className="flex justify-between">
					<div
						onClick={() => setLiquidityPoolActionType(LPActionType.DEPOSIT)}
						className={`m-2 text-zinc-800 hover:bg-zinc-100 hover:dark:bg-zinc-800  dark:text-zinc-200 cursor-pointer p-3 font-normal text-center w-full rounded-full text-xs ${
							LPActionType.DEPOSIT === liquidityPoolActionType
								? "bg-zinc-100 dark:bg-zinc-800 font-semibold"
								: ""
						}`}
					>
						Deposit
					</div>
					<div
						onClick={() => setLiquidityPoolActionType(LPActionType.WITHDRAW)}
						className={`m-2 text-zinc-700 hover:bg-zinc-100 hover:dark:bg-zinc-800  dark:text-zinc-200 cursor-pointer p-3 font-normal text-center w-full rounded-full text-xs  ${
							LPActionType.WITHDRAW === liquidityPoolActionType
								? "bg-zinc-100 dark:bg-zinc-800 font-semibold"
								: ""
						}`}
					>
						Withdraw
					</div>
				</div>
			</div>

			<div className="py-4">
				<div className="dark:bg-black border dark:border-zinc-900 rounded-lg py-4 p-2">
					{LPActionType.DEPOSIT === liquidityPoolActionType ? (
						<div className="flex items-center justify-between px-2">
							<p className="truncate font-sans text-xs font-normal dark:text-zinc-300">
								Wallet Balance
							</p>
							<div className="ml-2 flex flex-shrink-0">
								<p className="inline-flex font-sans text-xs font-normal leading-5 dark:text-zinc-300">
									{formatUSD(userBalance, { dps: 2 })}
								</p>
							</div>
						</div>
					) : (
						<div className="flex items-center justify-between px-2">
							<p className="truncate font-sans text-xs font-normal dark:text-zinc-300">
								Liquidity Balance
							</p>
							<div className="ml-2 flex flex-shrink-0">
								<p className="inline-flex font-sans text-xs font-normal leading-5 dark:text-zinc-300">
									{fromBigNumber(lpBalance)}
								</p>
							</div>
						</div>
					)}

					<div className="flex items-center justify-between px-2 pt-3">
						{LPActionType.DEPOSIT === liquidityPoolActionType ? (
							<DebounceInput
								minLength={1}
								debounceTimeout={300}
								onChange={async (e) => {
									if (e.target.value == "") return;
									setDepositAmount(toBN(e.target.value, decimals));
								}}
								type="number"
								name="size"
								id="size"
								value={fromBigNumber(depositAmount, decimals)}
								className="block ring-transparent outline-none w-64 bg-transparent pr-2 text-left dark:text-white font-normal text-2xl"
							/>
						) : null}

						{LPActionType.WITHDRAW === liquidityPoolActionType ? (
							<DebounceInput
								minLength={1}
								debounceTimeout={300}
								onChange={async (e) => {
									if (e.target.value == "") return;
									setWithdrawAmount(toBN(e.target.value));
								}}
								type="number"
								name="size"
								id="size"
								value={fromBigNumber(withdrawAmount)}
								className="block ring-transparent outline-none w-32 dark:bg-transparent pr-2 text-left dark:text-white font-normal text-2xl"
							/>
						) : null}
					</div>
				</div>
			</div>

			{isConnected ? (
				chain?.unsupported ? (
					<div>
						<div className="cursor-pointer border-2 border-orange-500 hover:border-orange-600 p-2 py-3 col-span-3 font-normal text-md dark:text-white text-center rounded-full">
							Unsupported Chain
						</div>
					</div>
				) : (
					<div>
						{userBalance &&
							toBN(userBalance.toString()).lt(depositAmount) &&
							LPActionType.DEPOSIT === liquidityPoolActionType && (
								<div
									onClick={() => console.warn("Add funds")}
									className="mb-4 cursor-disabled border-2 dark:border-zinc-800 border-zinc-100 dark:bg-zinc-800 p-2 py-3 col-span-3  font-semibold text-sm dark:text-white text-center rounded-full"
								>
									Insufficient Balance
								</div>
							)}

						{poolAllowance?.lt(depositAmount) &&
						LPActionType.DEPOSIT === liquidityPoolActionType ? (
							<Button
								isDisabled={false}
								label={"Approve USDC"}
								isLoading={isApproveQuoteLoading || isTxLoading}
								variant={"action"}
								radius={"full"}
								size={"full"}
								onClick={() => approveQuote?.()}
							/>
						) : null}

						{poolAllowance?.gte(depositAmount) &&
						LPActionType.DEPOSIT === liquidityPoolActionType ? (
							<Button
								isDisabled={false}
								label={"Deposit"}
								isLoading={isDepositLoading || isTxLoading}
								variant={"action"}
								radius={"full"}
								size={"full"}
								onClick={() => deposit?.()}
							/>
						) : null}

						{LPActionType.WITHDRAW === liquidityPoolActionType ? (
							<Button
								isDisabled={false}
								label={"Withdraw"}
								isLoading={isWithdrawLoading || isTxLoading}
								variant={"action"}
								radius={"full"}
								size={"full"}
								onClick={() => withdraw?.()}
							/>
						) : null}
					</div>
				)
			) : (
				!isLoading && !isConnected && openConnectModal && <WalletConnect />
			)}
		</div>
	);
};

export default SpreadLiquidityPool;
