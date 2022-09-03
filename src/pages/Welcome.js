import { Box, Heading, Paragraph, Anchor, Image } from "grommet";
import { memo, useCallback } from "react";
import MetaMaskImg from "./../assets/MetaMask.svg";
import styled from "styled-components";
import { ethers } from "ethers";

export const NETWORKS = {
	polygonMumbai: {
		name: "maticmum",
		chainId: 80001,
	}
};

const LoginButton = styled(Image)`
	margin-top: 40px;
	width: 40%;
	border: 2px solid #000;
	border-radius: 20px;
	padding: 20px;

	:hover {
		cursor: pointer;
	}
`;

export const Welcome = memo(({onConnect}) => {
	const handleReqAccount = useCallback(async (e) => {
		e.preventDefault();

		// try to switch network to Mumbai
		try {
			await window.ethereum.request({
				method: "wallet_switchEthereumChain",
				params: [{ chainId: ethers.utils.hexValue(NETWORKS.polygonMumbai.chainId) }],
			});
		} catch (switchError) {
			if (switchError.code === 4902) { // couldn't switch networks
				try {
					await window.ethereum.request({
						method: "wallet_addEthereumChain",
						params: [
							{
								chainId: ethers.utils.hexValue(NETWORKS.polygonMumbai.chainId),
								chainName: "Mumbai",
								rpcUrls: ["https://rpc-mumbai.matic.today"],
								nativeCurrency: {
									name: "Matic",
									symbol: "MATIC",
									decimals: 18
								},
								blockExplorerUrls: ["https://mumbai.polygonscan.com/"]
							},
						],
					});
				} catch (addError) {
					console.log("error switching chains");
				}
			}
		}

		const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
		const userAddress = ethers.utils.getAddress(accounts[0]);
		onConnect(userAddress);
	}, [onConnect])
	return <Box pad="medium">
		<Heading>Welcome! If you are new to WEB3</Heading>
		<Paragraph>This Blog is building with web3 techs and you need a wallet to connect.</Paragraph>
		<Paragraph>Please install <Anchor target="_blank" href="https://metamask.io/" label="MetaMask" /> for browsing.</Paragraph>
		<Paragraph>If you already have MetaMask installed, please click the button below to login.</Paragraph>
		<LoginButton src={MetaMaskImg} onClick={handleReqAccount} />
	</Box>
});
