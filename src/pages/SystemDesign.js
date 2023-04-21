import { List } from "grommet";
import { memo, useCallback } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Pinterest from "./../assets/system-design/Pinterest.jpeg";
import FaceBook from "./../assets/system-design/Facebook.jpg";
import InfiniteScroll from "./../assets/system-design/InfiniteScroll.jpg";
import Messenger from "./../assets/system-design/Messenger.jpeg";
import ProgressBar from "./../assets/system-design/ProgressBar.jpeg"
import TypeaheadWidget from "./../assets/system-design/TypeaheadWidget.jpeg";
import TodoApp from "./../assets/system-design/Todo.jpg";
import Rating from "./../assets/system-design/rating.jpeg";
import PollWidget from "./../assets/system-design/PollWidget.jpg";
import CarouselWidget from "./../assets/system-design/Carousel.jpg";
import Twitter from "./../assets/system-design/Twitter.jpg";
import QRcode from "./../assets/system-design/QRcode.jpg";

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
	},
	{
		title: "Progress Bar",
		url: "/progress-bar",
		id: 4,
		asset: ProgressBar
	},
	{
		title: "Typeahead Widget",
		url: "/typeahead-widget",
		id: 5,
		asset: TypeaheadWidget
	},
	{
		title: "Todo App",
		url: "/todo-app",
		id: 6,
		asset: TodoApp	
	},
	{
		title: "Rating Widget",
		url: "/rating-widget",
		id: 7,
		asset: Rating
	},
	{
		title: "Poll Widget",
		url: "/poll-widget",
		id: 8,
		asset: PollWidget
	},
	{
		title: "Carousel Widget",
		url: "/carousel-widget",
		id: 9,
		asset: CarouselWidget
	},
	{
		title: "Twitter",
		url: "/twitter",
		id: 10,
		asset: Twitter
	},
	{
		title: "QR Code",
		url: "/qr-code",
		id: 11,
		asset: QRcode
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
