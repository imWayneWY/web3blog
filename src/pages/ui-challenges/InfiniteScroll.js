import { memo, useCallback, useEffect, useState, useMemo, useRef } from "react";
import styled from "styled-components";
/**
 * Data emulator
 */
const getRandom = (min, max) => Math.random() * (max - min) + min;


const getItem = (index) => {
 return {
	 title: `Random Name - ${index}`,
	 desc: `
	 Random Description ${index} - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`.slice(
		 getRandom(100, 200)
	 ),
	 imgUrl: `https://picsum.photos/id/${index}/250/250`
 };
};

function db(
	getItem,
	size = 100,
	pageSize = 10,
) {
	const items = Array(size).fill(null).map((_, index) => getItem(index));
	return {
		load: (start, limit = pageSize) => {
			const chunk = items.slice(start, start + limit);
			const cursorInfo = {chunk, nextCursor: start + limit, prevCursor: start, size: chunk.length};
			return new Promise((resolve) => resolve(cursorInfo));
		}
	}
}

/**
 * component
 */

const ScrollWrapper = styled.div`
	width: 100%;
`;
const CardWrapper = styled.div`
	width: 600px;
	height: 240px;
	display: flex;
	align-items: center;
	margin: 20px auto;
	box-shadow: 0 0 7px 2px rgba(0,0,0,.1);
	border-radius: 6px;
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	transform: translateY(${props => props.$translateY}px);
`;

const CardDesc = styled.div`
	margin: 1rem;
`;

const CardImg = styled.img`
	border-radius: 50%;
	width: 150px;
	height: 150px;
	box-shadow: 0 0 0px 1px rgba(0,0,0,.1);
	padding: 1rem;	
`;
const Card = memo(({imgUrl, title, desc, translateY}) => {
	return <CardWrapper $translateY = {translateY}>
		<CardImg src={imgUrl} alt={title} />
		<CardDesc>
			<h2>{title}</h2>
			<p>{desc}</p>
		</CardDesc>
	</CardWrapper>
});

const Observer = styled.div`
	width: 70%;
	height: 48px;
	border: 1px solid blue;
	margin: 0 auto;
	background: rgba(0,0,255,0.25);
`;

const TopObserver = styled(Observer)``;
const BottomObserver = styled(Observer)`
	margin-top: ${props => props.$marginTop}px;
`;

const ScrollDirection = {
	UP: "up",
	DOWN: "down"
}

export const InfiniteScroll = memo(() => {
	const [items1, setItems1] = useState([]);
	const [items2, setItems2] = useState([]);
	const [isSetItems1, setIsSetItems1] = useState(true);
	const [start, setStart] = useState(0);
	const [end, setEnd] = useState(0);
	const topRef = useRef();
	const bottomRef = useRef();
	const [bottomMarginTop, setBottomMarginTop] = useState(20);

	const handleTopIntersection = useCallback(async () => {}, []);
	const handleBottomIntersection = useCallback(async () => {
		const { chunk } = await db(getItem).load(end, 10);
		if (isSetItems1) {
			setItems1(chunk.map((item, idx) => {
				return {
					...item,
					order: end+idx,
				}
			}));	
		} else {
			setItems2(chunk.map((item, idx) => {
				return {
					...item,
					order: end+idx,
				}
			}));	
		}
		setBottomMarginTop(getTranslateY(end + 9));
		setEnd(end => end + 10);
		setIsSetItems1(b => !b)
	}, [end, isSetItems1]);

	const update = useCallback(async(trigger) => {
		switch(trigger) {
			case ScrollDirection.UP:
				await handleTopIntersection();
				break;
			case ScrollDirection.DOWN:
				await handleBottomIntersection();
				break;
			default:
				break;
		}
	}, [handleTopIntersection, handleBottomIntersection]);

	useEffect(() => {
		const topCb = async ([entry]) => {
			if (entry.intersectionRatio > 0.1) {
				update(ScrollDirection.UP);
			}
		};
		const bottomCb = async ([entry]) => {
			if (entry.intersectionRatio > 0.1) {
				update(ScrollDirection.DOWN);
			}
		};
		const topObserver = new IntersectionObserver(topCb, { threshold: 0.25 });
		const bottomObserver = new IntersectionObserver(bottomCb, { threshold: 0.25 });
		topObserver.observe(topRef.current);
		bottomObserver.observe(bottomRef.current);
		return () => {
			topObserver.disconnect();
			bottomObserver.disconnect();
		}
	}, [update]);

	return <ScrollWrapper>
		<TopObserver ref={topRef} />
		{!!items1?.length && items1.map((item, idx) => <Card {...item} key={idx} translateY={getTranslateY(item.order)} />)}
		{!!items2?.length && items2.map((item, idx) => <Card {...item} key={idx} translateY={getTranslateY(item.order)} />)}
		<BottomObserver ref={bottomRef} $marginTop={bottomMarginTop}/>
	</ScrollWrapper>;
})

function getTranslateY(order) {
	return 260 * order;
}