import { useState, useCallback } from "react";
import MDEditor from '@uiw/react-md-editor';
import { Box, Button } from "grommet";
import styled from "styled-components";
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { useWallet } from "../hooks/useWallet";
import { Buffer } from 'buffer';

const projectId = process.env.REACT_APP_PROJECT_ID;
const projectSecret = process.env.REACT_APP_PROJECT_ID;

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
	const { selectedAddress } = useWallet();
	const [value, setValue] = useState("**Hello world!!!**");
	const handlePost = useCallback(async (e) => {
		e.preventDefault();
		if (value.trim() === "") return;
		try {
			const result = await client.add(JSON.stringify({ author: selectedAddress, value, date: Date.now()}));
			console.log(result);
			console.log("uri:", `https://ipfs.infura.io/ipfs/${result.path}`);
		} catch(error) {
			console.error("IPFS upload error!")
			console.error(error);
		}
 	}, [selectedAddress, value]);
	return (
		<Box width='100%' height='100vh'>
			<MDEditor
				height='100%'
				value={value}
				onChange={setValue}
			/>
			<PostButton label="POST" color="neutral-3" primary size="large" onClick={handlePost} />
		</Box>
	);
}