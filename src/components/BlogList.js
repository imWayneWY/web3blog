import { memo, useCallback } from "react";
import { Troubleshoot } from "grommet-icons";
import { Paragraph, List, Box } from "grommet";
import styled from "styled-components";
import { useNavigate } from "react-router-dom"

const TenItemList = styled(List)`
	width: 100%;
`;

export const BlogList = memo(({ items, currentPage, totalBlogsCount, isOwner }) => {
	const navigate = useNavigate();
	const handleClick = useCallback(({ item, index }) => {
		navigate("/detail", { state: { id: getBlogId(index, currentPage, totalBlogsCount), title: item, isOwner } });
	}, [currentPage, isOwner, navigate, totalBlogsCount]);

	return <>{
		items?.length
			? <TenItemList
				data={items}
				onClickItem={handleClick}
				pad="medium"
			/>
			: <Box justify="center" align="center" flex="grow">
				<Troubleshoot size="large" />
				<Paragraph>Nothing here yet...(Still building)</Paragraph>
			</Box>
	}</>;
});

function getBlogId(index, currentPage, totalBlogsCount) {
	return totalBlogsCount - ((currentPage - 1) * 10) - index
}