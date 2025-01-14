import React, { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";
import { Strategy, StrategyDirection, StrategyTag, StrategyType } from "../../../utils/types";
import { useBuilderContext } from "../../../context/BuilderContext";
import { strategies } from "../../../strategies";
import ETHIcon from "../../UI/Icons/Color/ETH";
import BTCIcon from "../../UI/Icons/Color/BTC";
import { CUSTOM } from "../../../utils/placeholders/strategy";

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(" ");
}

export const SelectStrategy = () => {
	const { selectedMarket, selectedDirectionTypes, selectedStrategy, handleSelectedStrategy } =
		useBuilderContext();

	const [filteredStrategies, setFilteredStrategies] = useState<Strategy[]>([]);

	useEffect(() => {
		if (selectedDirectionTypes) {
			const _selectedDirectionTypesIds = selectedDirectionTypes.id;
			const _filteredStrategies = strategies.filter((strategy) => {
				return strategy.type.some((r) => r == _selectedDirectionTypesIds);
			});
			setFilteredStrategies(_filteredStrategies);
		} else {
			setFilteredStrategies([]);
		}
	}, [selectedDirectionTypes]);

	const isSelected = (_strategy: Strategy) => selectedStrategy?.id == _strategy.id;

	return (
		<Listbox
			value={selectedDirectionTypes}
			onChange={(data: any) => {
				handleSelectedStrategy(data);
			}}
		>
			{({ open }) => (
				<>
					<div className="relative">
						<Listbox.Button className="relative w-full rounded-full cursor-pointer   bg-zinc-100 dark:bg-zinc-800   pl-4 pr-20 text-left dark:text-white text-sm py-2">
							<div className="flex items-center">
								<div>
									{selectedMarket?.name == "ETH-USDC" ? (
										<ETHIcon className="bg-emerald-400 rounded-full w-6 h-6" />
									) : (
										<BTCIcon className="bg-emerald-400 rounded-full w-6 h-6" />
									)}
								</div>
								{selectedStrategy ? (
									<div className="pl-1 text-sm font-semibold">{selectedStrategy.name}</div>
								) : (
									<div className="pl-1 text-sm font-normal text-zinc-900 dark:text-zinc-200">
										Select a Prebuilt Strategy
									</div>
								)}
							</div>
							<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
								<ChevronUpDownIcon className="h-5 w-5 dark:text-gray-400" aria-hidden="true" />
							</span>
						</Listbox.Button>

						<Transition
							show={open}
							as={Fragment}
							enter="transition ease-in duration-200"
							leave="transition ease-in duration-100"
							enterFrom="opacity-0"
							enterTo="opacity-100"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<Listbox.Options className="overflow-hidden bg-white w-full rounded-xl absolute z-10 mt-1 dark:bg-zinc-800 focus:outline-none cursor-pointer">
								{[CUSTOM].concat(filteredStrategies).map((strategy: Strategy, index: number) => (
									<Listbox.Option
										key={index}
										className={({ active }) =>
											classNames(
												active ? " bg-zinc-100 dark:bg-zinc-700" : "dark:text-white",
												"relative cursor-default select-none py-2 pl-3 pr-9"
											)
										}
										value={strategy}
									>
										{({ active }) => {
											const selected = isSelected(strategy);
											const { name, description, type, tags } = strategy;

											return (
												<>
													<div className="flex items-center">
														<span
															className={classNames(
																selected ? "font-semibold" : "font-normal",
																"block truncate text-sm"
															)}
														>
															{name}
														</span>
													</div>

													<div className="flex flex-wrap">
														{tags.map((tag: StrategyTag, index: number) => {
															if (StrategyTag.PostMaxLossOnly === tag) {
																return (
																	<span
																		key={index}
																		className="text-xxs font-normal rounded-sm dark:bg-emerald-600 dark:text-zinc-200 bg-emerald-400 text-white p-1 mr-1"
																	>
																		{tag}
																	</span>
																);
															}
															return (
																<span
																	key={index}
																	className="text-xxs font-light rounded-sm bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-100 p-1 mr-1"
																>
																	{tag}
																</span>
															);
														})}
													</div>

													{selected ? (
														<span
															className={classNames(
																active ? "dark:text-white" : "text-emerald-400",
																"absolute inset-y-0 right-0 flex items-center pr-4"
															)}
														>
															<CheckIcon className="h-5 w-5" aria-hidden="true" />
														</span>
													) : null}
												</>
											);
										}}
									</Listbox.Option>
								))}
							</Listbox.Options>
						</Transition>
					</div>
				</>
			)}
		</Listbox>
	);
};
