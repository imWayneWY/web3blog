import { memo } from "react";
import { Troubleshoot } from "grommet-icons";
import { Box, Paragraph } from "grommet";

export const List = memo((items) => {
	return <>
		{
			items?.length
				? <></>
				: <Box width='100%' align="center" justify="center">
					<Troubleshoot size="large" />
					<Paragraph>Nothing here yet...</Paragraph>
				</Box>
		}</>;
});