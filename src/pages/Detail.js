import { memo, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useWallet } from "../hooks/useWallet";
import BlogAbi from "../abi/Web3Blog.json";
import { ethers } from "ethers";
import { Markdown, Heading, Text, Box } from "grommet";


const BlogAddress = "0x2FC33901Ee4c5A790C2Ef7977B5cDc562CF6a045";

export const Detail = memo(() => {
	const { signer } = useWallet();
	const [contract, setContract] = useState();
	const [date, setDate] = useState();
	const [value, setValue] = useState("");
	const [title, setTitle] = useState("");
	const [author, setAuthor] = useState("");

	const location = useLocation();

	useEffect(() => {
		if (!signer) return;
		const BlogContract = new ethers.Contract(
			BlogAddress,
			BlogAbi.abi,
			signer
		)
		setContract(BlogContract);
	}, [signer]);

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

	return <Box pad="medium" flex="grow" direction="column">
		<Heading>{title}</Heading>
		<Text>Author: {author}</Text>
		<Text>{new Date(date).toLocaleDateString()}</Text>
		<Markdown style={{marginTop: "20px"}}>{value}</Markdown>
	</Box>;
});
