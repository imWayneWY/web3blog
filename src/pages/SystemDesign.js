import { List } from "grommet";
import { memo, useCallback } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Pinterest from "./../assets/system-design/Pinterest.jpeg";
import FaceBook from "./../assets/system-design/Facebook.jpg";
import InfiniteScroll from "./../assets/system-design/InfiniteScroll.jpg";
import Messenger from "./../assets/system-design/Messenger.jpeg";

const SystemDesignList = styled(List)`
	width: 100%;
`;

export const SystemDesigns = [
	{
		title: "Pinterest",
		url: "/pinterest",
		id: 0,
		asset: Pinterest
	},
	{
		title: "Facebook",
		url: "/facebook",
		id: 1,
		asset: FaceBook
	},
	{
		title: "Infinite Scroll",
		url: "/InfiniteScroll",
		id: 2,
		asset: InfiniteScroll
	},
	{
		title: "Messenger",
		url: "/messenger",
		id: 3,
		asset: Messenger
	}
]

export const SystemDesign = memo(() => {
	const navigate = useNavigate();

	const handleClick = useCallback(({item}) => {
		navigate("/sd-detail", { state: {id: item.id}});
	}, [navigate]);

	return <>
		<SystemDesignList
			data={SystemDesigns}
			primaryKey="title"
			onClickItem={handleClick}
			pad="medium"
		/>
	</>
});
