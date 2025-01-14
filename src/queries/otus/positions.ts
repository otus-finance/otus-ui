import { BigNumber, BigNumberish } from "ethers";
import request, { gql } from "graphql-request";
import { Query, UseQueryResult, useQuery } from "react-query";
import { Address, useAccount, useNetwork } from "wagmi";
import { getOtusEndpoint } from "../../utils/endpoints";
import { LPUser } from "./user";
import Lyra, { Position as LyraPosition } from "@lyrafinance/lyra-js";
import { fromBigNumber } from "../../utils/formatters/numbers";

const QUERY_KEYS = {
	POSITION: {
		SpreadPosition: (addr: string | undefined) => ["spread_positions", addr],
	},
};

type PositionData = {
	positions: Position[];
};

export type Position = {
	id: BigNumber;
	owner: Address;
	market: string;
	state: BigNumberish;
	openTimestamp: number;
	txHash: string;
	allPositions: [];
	tradeType: BigNumberish;
	lyraPositions: LyraPosition[];
	isInTheMoney: boolean;
	unrealizedPnl: number;
	totalCost: number;
	expiry: number;
	trade: Trade;
};

type Trade = {
	cost: BigNumber;
	fee: BigNumber;
	marginBorrowed: BigNumber;
};

export const usePositions = (lyra?: Lyra) => {
	const { chain } = useNetwork();
	const { address: owner } = useAccount();

	const otusEndpoint = getOtusEndpoint(chain?.id);
	return useQuery<PositionData | null | undefined>(
		QUERY_KEYS.POSITION.SpreadPosition(owner?.toLowerCase()),
		async () => {
			if (!owner) return null;
			if (!chain) return null;
			if (!otusEndpoint) return null;
			const response: PositionData = await request(
				otusEndpoint,
				gql`
					query ($owner: String!) {
						positions(where: { owner: $owner, state: 0 }) {
							id
							market
							owner
							state
							openTimestamp
							txHash
							allPositions
							tradeType
							state
							trade {
								cost
								fee
								marginBorrowed
							}
						}
					}
				`,
				{ owner: owner.toLowerCase() }
			);

			if (lyra) {
				const positionsWithLegs: Position[] = await Promise.all(
					response.positions.map(async (position: Position) => {
						const { allPositions, market, tradeType, trade } = position;

						const positions: LyraPosition[] = await Promise.all(
							allPositions.map(async (id) => {
								return await lyra.position("ETH-USDC", id);
							})
						);

						const calculatePosition = positions.reduce(
							(positionTotals: PositionTotal, position: LyraPosition) => {
								const { expiryTimestamp } = position;
								const { unrealizedPnl, totalAverageOpenCost } = position.pnl();

								return {
									expiry:
										positionTotals.expiry > expiryTimestamp
											? positionTotals.expiry
											: expiryTimestamp,
									unrealizedPnl: positionTotals.unrealizedPnl + fromBigNumber(unrealizedPnl),
									totalAverageOpenCost:
										positionTotals.totalAverageOpenCost + fromBigNumber(totalAverageOpenCost),
								};
							},
							{ unrealizedPnl: 0, totalAverageOpenCost: 0, expiry: 0 } as PositionTotal
						);

						return {
							...position,
							unrealizedPnl: calculatePosition.unrealizedPnl,
							expiry: calculatePosition.expiry,
							totalCost:
								tradeType === TradeType.Multi
									? calculatePosition.totalAverageOpenCost
									: fromBigNumber(trade.cost),
							lyraPositions: positions,
						} as Position;
					})
				);

				return { ...response, positions: positionsWithLegs };
			}

			return { ...response, lyraPositions: [] };
		},
		{
			enabled: true,
		}
	);
};

type PositionTotal = {
	expiry: number;
	unrealizedPnl: number;
	totalAverageOpenCost: number;
};

enum TradeType {
	Multi = 0,
	Spread = 1,
}
// type OtusPositionPnl = {
// 	unrealizedPnl = BigNumber;
// settlementPnl: BigNumber;
// }
