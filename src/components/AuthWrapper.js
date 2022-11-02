import { useWallet } from "../hooks/useWallet";
import {memo, useMemo} from "react";
import { Welcome } from "../pages/Welcome";

export const AuthWrapper = memo(({children, needAddress=false}) => {
	const { selectedAddress, hasEthereum } = useWallet();
	const showWelcome = useMemo(() => !hasEthereum || (needAddress && !selectedAddress), [hasEthereum, needAddress, selectedAddress]);
	
	return <>{
		showWelcome
		? <Welcome />
		: children
	}</>
});
