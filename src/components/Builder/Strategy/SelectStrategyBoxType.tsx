import React, { useEffect, useState } from "react";
import { Strategy, StrategyTag } from "../../../utils/types";
import { useBuilderContext } from "../../../context/BuilderContext";
import { strategies } from "../../../strategies";
import { motion } from "framer-motion";

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(" ");
}

export const SelectStrategyBoxType = () => {
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
			if (_filteredStrategies && _filteredStrategies.length > 0) {
				handleSelectedStrategy(_filteredStrategies[0]);
			}
		} else {
			setFilteredStrategies([]);
		}
	}, [selectedDirectionTypes]);

	const isSelected = (_strategy: Strategy) => selectedStrategy?.id == _strategy.id;

	return (
		<div className="grid grid-cols-2 gap-2 m-2 ">
			{[CUSTOM].concat(filteredStrategies).map((strategy: Strategy, index: number) => {
				const selected = isSelected(strategy);
				const isSelectedStyle = selected
					? "border-emerald-400 dark:border-emerald-400"
					: "border-zinc-100 dark:border-zinc-800";

				const { id, name, description, type, tags } = strategy;

				return (
					<motion.div
						whileHover={{ opacity: 0.8 }}
						whileTap={{ scale: 0.99 }}
						transition={{ duration: 250 }}
						onClick={() => handleSelectedStrategy(strategy)}
						key={index}
						className={`w-full items-center border-2 mr-4 peer-last:mr-0 bg-white dark:bg-inherit  first:ml-0 last:mr-0 p-4 rounded-xl cursor-pointer ${isSelectedStyle}`}
					>
						<div className="flex items-center">
							<span
								className={classNames(selected ? "font-semibold" : "font-normal", "block truncate")}
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
											className="text-xs font-normal rounded-sm dark:bg-emerald-600 dark:text-zinc-200 bg-emerald-400 text-white p-1 mr-1"
										>
											{tag}
										</span>
									);
								}
								return (
									<span
										key={index}
										className="text-xs font-light rounded-sm bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-100 p-1 mr-1"
									>
										{tag}
									</span>
								);
							})}
						</div>
						{id === CUSTOM.id ? (
							<div className="flex flex-wrap text-sm font-light">{description}</div>
						) : null}
					</motion.div>
				);
			})}
		</div>
	);
};

export const CUSTOM: Strategy = {
	id: 999,
	name: "Custom",
	description: "Build your own strategy",
	type: [],
	tags: [],
	trade: [],
};