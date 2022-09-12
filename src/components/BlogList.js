import { memo } from "react";
import { Troubleshoot } from "grommet-icons";
import { Box, Paragraph, List } from "grommet";
import { Link } from "react-router-dom";

export const BlogList = memo(({items}) => {
	return <>
		{
			items?.length
				? <List 
					data={items}
					step={10}
					paginate
				/>
				: <Box width='100%' align="center" justify="center">
					<Troubleshoot size="large" />
					<Paragraph>Nothing here yet...(Still building)</Paragraph>
					<Link to="/todo" >todo (a little web3 demo for fun)</Link>
				</Box>
		}</>;
});