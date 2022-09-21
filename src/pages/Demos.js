import { List } from "grommet";
import { memo, useCallback } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom"

const DemoList = styled(List)`
	width: 100%;
`;

const DEMOS = [
	{
		title: "Todo",
		url: "/todo"
	},
	{
		title: "Calendar",
		url: "/calendar"
	}
]

export const Demos = memo(() => {
	const navigate = useNavigate();

	const handleClick = useCallback(({item}) => {
		navigate(item.url);
	}, [navigate]);

	return <>
		<DemoList
			data={DEMOS}
			primaryKey="title"
			onClickItem={handleClick}
			pad="medium"
		/>
	</>
});
