import { memo, useCallback } from "react";
import { Troubleshoot } from "grommet-icons";
import { Box, Paragraph, List } from "grommet";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom"

const TenItemList = styled(List)`
	width: 100%;
`;

export const BlogList = memo(({ items }) => {
	const navigate = useNavigate();
	const handleClick = useCallback(({item, index}) => {
		navigate("/detail", {state: {id: index + 1, title: item}});
	}, [navigate]);
	return <Box pad="medium" align="center" justify="start" flex="grow">
		{
			items?.length
				? <TenItemList
					data={items}
					onClickItem ={handleClick}
				/>
				: <>
					<Troubleshoot size="large" />
					<Paragraph>Nothing here yet...(Still building)</Paragraph>
					<Link to="/todo" >todo (a little web3 demo for fun)</Link>
				</>
		}</Box>;
});