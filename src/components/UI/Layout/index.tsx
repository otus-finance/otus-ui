import React, { ReactElement } from "react";

import { Navigation } from "../../../components/Navigation";
import { FooterNav } from "../../../components/Navigation/footer";
import { AdminContextProvider } from "../../../context/Admin/AdminContext";
import { AdminMessage } from "../../Admin/Banner";

interface Props {
	children: ReactElement;
}

export default function Layout({ children }: Props) {
	return (
		<div className="min-h-screen">
			<AdminContextProvider>
				<AdminMessage />
			</AdminContextProvider>
			<Navigation />
			<main className="px-0 sm:px-4 md:px-6 lg:px-8">{children}</main>
			<FooterNav />
		</div>
	);
}
