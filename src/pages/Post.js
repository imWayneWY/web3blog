import { useState, useCallback, useEffect } from "react";
import MDEditor from '@uiw/react-md-editor';
import { Button, TextInput } from "grommet";
import styled from "styled-components";
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { useWallet } from "../hooks/useWallet";
import { Buffer } from 'buffer';
import BlogAbi from "../abi/Web3Blog.json";
import { ethers } from "ethers";

const BlogAddress = "0x2FC33901Ee4c5A790C2Ef7977B5cDc562CF6a045";

const projectId = process.env.REACT_APP_PROJECT_ID;
const projectSecret = process.env.REACT_APP_PROJECT_SECRET;

const auth =
    'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = ipfsHttpClient({
	host: 'ipfs.infura.io',
	port: 5001,
	protocol: 'https',
	headers: {
		authorization: auth,
	},
});

const PostButton = styled(Button)`
	position: fixed;
	bottom: 40px;
	right: 40px;
`;

export const Post = () => {
	const { selectedAddress, signer } = useWallet();
	const [value, setValue] = useState("**Hello world!!!**");
	const [contract, setContract] = useState();
	const [title, setTitle] = useState("");

	useEffect(() => {
		if (!signer) return;
		const BlogContract = new ethers.Contract(
			BlogAddress,
			BlogAbi.abi,
			signer
		)
		setContract(BlogContract);
	}, [signer]);

	const handleUpdate = useCallback((e) => {
		setTitle(e.target.value);
	}, [])

	const handlePost = useCallback(async (e) => {
		e.preventDefault();
		if (value.trim() === "" || title.trim() === "" || !contract || !selectedAddress) return;
		try {
			const result = await client.add(JSON.stringify({ author: selectedAddress, value, date: Date.now()}));
			await contract.createBlog(`https://wei.infura-ipfs.io/ipfs/${result.path}`, ethers.utils.formatBytes32String(title.trim()));
			// todo: redirect to success or home page
		} catch(error) {
			console.error("IPFS upload error!")
			console.error(error);
		}
 	}, [contract, selectedAddress, title, value]);
	return (
		<>
			<TextInput placeholder="Input your blog title" onChange={handleUpdate} value={title} />
			<MDEditor
				height='90%'
				value={value}
				onChange={setValue}
			/>
			<PostButton label="POST" color="neutral-3" primary size="large" onClick={handlePost} />
		</>
	);
}