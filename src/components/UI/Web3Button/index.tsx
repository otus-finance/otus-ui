import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { OfflineChainSelect } from "./ChainSelect";

export const Web3Button = () => {
	return (
		<ConnectButton.Custom>
			{({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
				// Note: If your app doesn't use authentication, you
				// can remove all 'authenticationStatus' checks
				const connected = mounted && account && chain ? true : false;

				return (
					<div
						{...(!mounted && {
							"aria-hidden": true,
							style: {
								opacity: 0,
								pointerEvents: "none",
								userSelect: "none",
							},
						})}
					>
						{(() => {
							if (!connected) {
								return (
									<div className="flex gap-4">
										<OfflineChainSelect />
										<button
											onClick={openConnectModal}
											type="button"
											className="flex items-center dark:bg-zinc-900 bg-zinc-300 p-3 rounded-full dark:text-white text-sm font-semibold"
										>
											Connect
										</button>
									</div>
								);
							}
							if (chain?.unsupported) {
								return (
									<button
										onClick={openChainModal}
										type="button"
										className="flex items-center dark:bg-zinc-900 bg-zinc-300 p-3 rounded-full dark:text-white text-sm font-semibold"
									>
										Wrong network
									</button>
								);
							}
							return (
								<div className="flex gap-4">
									<button
										onClick={openChainModal}
										className="flex items-center dark:bg-zinc-900 bg-zinc-300 p-3 rounded-full dark:text-white text-sm font-semibold"
										type="button"
									>
										{chain?.hasIcon && (
											<div
												className={`dark:bg-[${chain.iconBackground}] h-5 w-5 rounded-full overflow-hidden mr-2`}
											>
												{chain.iconUrl && (
													<img
														alt={chain.name ?? "Chain icon"}
														src={chain.iconUrl}
														className="w-5 h-5"
													/>
												)}
											</div>
										)}
										{chain?.name}
										<div className="ml-2">
											<ChevronDownIcon className="h-4 w-4 dark:text-white font-bold" />
										</div>
									</button>
									<button
										className="flex items-center dark:bg-zinc-900 bg-zinc-300 p-3 rounded-full dark:text-white text-sm font-semibold"
										onClick={openAccountModal}
										type="button"
									>
										{account?.displayName}

										<span className="hidden sm:block">
											{account?.displayBalance ? ` (${account?.displayBalance})` : ""}
										</span>
									</button>
								</div>
							);
						})()}
					</div>
				);
			}}
		</ConnectButton.Custom>
	);
};
