import { memo, useEffect, useState } from "react";
import { useWallet } from "../hooks/useWallet";
import BlogAbi from "../abi/Web3Blog.json";
import { ethers } from "ethers";
import { BlogList } from "../components/BlogList";
import { Pagination, Box } from "grommet";

const BlogAddress = "0x2FC33901Ee4c5A790C2Ef7977B5cDc562CF6a045";

export const Main = memo(() => {
	const { signer } = useWallet();
	const [contract, setContract] = useState();
	const [items, setItems] = useState([]);
	const [totalBlogsCount, setTotalBlogsCount] = useState(11);
	const [currentPage, setCurrentPage] = useState(1);

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
		async function fetchTitles() {
			try {
				const result = await contract.fetchTitles(currentPage, true);
				setItems([...result.filter(res => res !== "0x").map(res => ethers.utils.parseBytes32String(res))]);
			} catch(error) {
				console.error(`Fetch titles error on page ${currentPage}, descend: ${true}`);
				console.error(error);
			}
	
		}
		fetchTitles();
	}, [contract, currentPage]);
	return <Box pad="medium" align="center" justify="between" flex="grow" overflow="auto" height="100vh">
		<BlogList items={items} currentPage={currentPage} totalBlogsCount={totalBlogsCount}/>
		<Pagination numberItems={totalBlogsCount} page={currentPage} onChange={({page}) => setCurrentPage(page)}/>
	</Box>;
})