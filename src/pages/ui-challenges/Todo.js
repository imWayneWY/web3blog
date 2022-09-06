import { memo, useState, useEffect } from "react";
import { useWallet } from "../../hooks/useWallet";

export const Todo = memo(() => {
	const [tasks, setTasks] = useState([]);
	const { selectedAddress, provider, signer } = useWallet();
	return <></>;
});
