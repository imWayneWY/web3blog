import { useState, useEffect } from "react";
import { ethers } from "ethers";

export const useWallet = () => {
	const [selectedAddress, setSelectedAddress] = useState();
	const [provider, setProvider] = useState();
	const [signer, setSigner] = useState();

	useEffect(() => {
		const getSelectedAddress = async () => {
			try {
				const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
				const userAddress = ethers.utils.getAddress(accounts[0]);
				setSelectedAddress(userAddress);
			} catch(err) {
				console.warn("user not willing to connect", err);
			}
		}
		// Getting new wallet provider...
		if (window.ethereum) {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			setProvider(provider);
			getSelectedAddress();
		}
	}, []);

	useEffect(() => {
		async function getSigner() {
			setSigner(await provider.getSigner());
		}
		if (provider) {
			getSigner();
		}
	}, [provider]);


	useEffect(() => {
		if (!provider) return;
		const { provider: ethereum } = provider;
		const eventName = `accountsChanged`;

		const listener = ([selectedAddress]) => {
			setSelectedAddress(selectedAddress);
		};

		// listen for updates
		ethereum.on(eventName, listener);

		// clean up on unmount
		return () => {
			ethereum.removeListener(eventName, listener);
		};
	}, [provider]);

	return {
		selectedAddress,
		provider,
		signer,
	}
}