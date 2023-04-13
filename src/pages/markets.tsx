import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { BuilderContextProvider } from "../context/BuilderContext";
import { OptionsBuilder } from "../components/Builder";
import Layout from "../components/UI/Layout";
import SpreadLiquidityPool from "../components/Vaults/SpreadLiquidityPool";
import { toBN } from "../utils/formatters/numbers";
import { SpreadLiquidityPoolContextProvider } from "../context/SpreadLiquidityPoolContext";
import Market from "../components/Vaults/RangedMarketTokens";
import { useRangedMarkets } from "../queries/otus/rangedMarkets";
import { Spinner } from "../components/UI/Components/Spinner";

const Markets: NextPage = () => {
	const { isLoading, data } = useRangedMarkets();

	return (
		<div>
			<Head>
				<title>Otus Finance: Spread Options Trading, Limit Orders and Vaults</title>
				<meta name="description" content="Spread Options Trading, Limit Orders and Vaults" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Layout>
				<div className="mx-auto max-w-screen-2xl py-14 text-white">
					{isLoading ? <Spinner /> : null}

					<div className="grid md:grid-cols-2 xl:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-12">
						{data?.rangedMarkets.map((market, index) => {
							return (
								<div key={index} className="col-span-1">
									<div className="cursor-disabled rounded-xl bg-gradient-to-b from-blue-600 to-emerald-600  shadow-lg shadow-black">
										<Market market={market} />
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</Layout>
		</div>
	);
};

export default Markets;
