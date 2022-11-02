import { memo, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useWallet } from "../hooks/useWallet";
import BlogAbi from "../abi/Web3BlogOwner.json";
import { ethers } from "ethers";
import { Markdown, Heading, Text } from "grommet";
import GuestAbi from "../abi/Web3BlogGuest.json";
import { BlogAddress, GuestBlogAddress } from "../utils/address";


export const Detail = memo(() => {
	const { provider } = useWallet();
	const [contract, setContract] = useState();
	const [date, setDate] = useState();
	const [value, setValue] = useState("");
	const [title, setTitle] = useState("");
	const [author, setAuthor] = useState("");

	const location = useLocation();

	useEffect(() => {
		if (!provider || location.state.isOwner === undefined) return;
		if (location.state.isOwner) {
			const BlogContract = new ethers.Contract(
				BlogAddress,
				BlogAbi.abi,
				provider
			)
			setContract(BlogContract);
		} else {
			const BlogContractGuest = new ethers.Contract(
				GuestBlogAddress,
				GuestAbi.abi,
				provider
			)
			setContract(BlogContractGuest);
		}
	}, [provider, location.state.isOwner]);

	useEffect(() => {
		if (!contract) return;
		async function fetchURI() {
			try {
				const URI = await contract.tokenURI(location.state.id);
				const response = await fetch(URI);
				const data = await response.json();
				setDate(data.date);
				setAuthor(data.author);
				setValue(data.value);
				setTitle(location.state.title);
			} catch(error) {
				console.error(`Fetching URL faild on ID: ${location.state.id}`);
				console.error(error);
			}
		}
		fetchURI();
	}, [contract, location.state.id, location.state.title]);

	return <>
		<Heading>{title}</Heading>
		<Text>Author: {author}</Text>
		<Text>{new Date(date).toLocaleDateString()}</Text>
		<Markdown style={{marginTop: "20px"}}>{value}</Markdown>
	</>;
});
