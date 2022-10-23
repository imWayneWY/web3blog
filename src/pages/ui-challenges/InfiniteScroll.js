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
	display: flex;
	align-items: center;
	margin: 2rem auto;
	box-shadow: 0 0 7px 2px rgba(0,0,0,.1);
	border-radius: 6px;
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
const Card = memo(({imgUrl, title, desc}) => {
	return <CardWrapper>
		<CardImg src={imgUrl} alt={title} />
		<CardDesc>
			<h2>{title}</h2>
			<p>{desc}</p>
		</CardDesc>
	</CardWrapper>
});

const BottomObserver = styled.div`
	width: 70%;
	height: 48px;
	border: 1px solid blue;
	margin: 0 auto;
	background: rgba(0,0,255,0.25);
`;

export const InfiniteScroll = memo(() => {
	const [items, setItems] = useState([]);
	const [cursor, setCursor] = useState(0);
	const ref = useRef();

	const loadItems = useCallback(async () => {
		const { chunk } = await db(getItem).load(cursor, 10);
		setItems(items => [...items, ...chunk]);
		setCursor(c => c + 10);
	}, [cursor]);

	useEffect(() => {
		const callback = ([entry]) => {
			if (entry.intersectionRatio > 0.1) {
				loadItems();
			}
		};
		const observer = new IntersectionObserver(callback, { threshold: 0.25 });
		observer.observe(ref.current);
		return () => observer.disconnect();
	}, [loadItems]);

	return <ScrollWrapper>
		{!!items?.length && items.map((item, idx) => <Card {...item} key={idx}/>)}
		<BottomObserver ref={ref} />
	</ScrollWrapper>;
})