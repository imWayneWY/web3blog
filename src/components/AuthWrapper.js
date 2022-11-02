import { useWallet } from "../hooks/useWallet";
import {memo} from "react";
import { Welcome } from "../pages/Welcome";

export const AuthWrapper = memo(({children}) => {
	const { selectedAddress } = useWallet();
	return <>{
		selectedAddress
		? {children}
		: <Welcome />
	}</>
});
