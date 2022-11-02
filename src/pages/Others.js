import { memo, useEffect, useState } from "react";
import { useWallet } from "../hooks/useWallet";
import BlogAbi from "../abi/Web3BlogGuest.json";
import { ethers } from "ethers";
import { BlogList } from "../components/BlogList";
import { Pagination, Box } from "grommet";
import { GuestBlogAddress } from "../utils/address";

export const Others = memo(() => {
	const { provider } = useWallet();
	const [contract, setContract] = useState();
	const [items, setItems] = useState([]);
	const [totalBlogsCount, setTotalBlogsCount] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		if (!provider) return;
		const BlogContract = new ethers.Contract(
			GuestBlogAddress,
			BlogAbi.abi,
			provider
		)
		setContract(BlogContract);
	}, [provider]);

	useEffect(() => {
		if (!contract) return;
		async function fetchTitles() {
			try {
				const result = await contract.fetchTitles(currentPage, true);
				setItems([...result.filter(res => res !== "0x")
					.map(res => res.length < 66 ? res.padEnd(66, '0') : res)
					.map(res => ethers.utils.parseBytes32String(res))]);
				const totalBlogsCountRes = await contract.getCount();
				setTotalBlogsCount(totalBlogsCountRes.toNumber());
			} catch(error) {
				console.error(`Fetch titles error on page ${currentPage}, descend: ${true}`);
				console.error(error);
			}
	
		}
		fetchTitles();
	}, [contract, currentPage]);
	return <Box pad="medium" align="center" justify="between" flex="grow" overflow="auto" height="100vh">
		<BlogList items={items} currentPage={currentPage} totalBlogsCount={totalBlogsCount} isOwner={false} />
		<Pagination numberItems={totalBlogsCount} page={currentPage} onChange={({page}) => setCurrentPage(page)}/>
	</Box>;
})