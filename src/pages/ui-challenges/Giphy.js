import { memo, useCallback, useEffect, useState, useLayoutEffect } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
	width: 100%;
	min-height: 100vh;
	display: flex;
`;

const Column = styled.div`
	flex: 1;
`;
const URL = "https://picsum.photos/v2/list";
const amount = 50;

export const Giphy = memo(() => {
	const [images, setImages] = useState([]);
	const [wrapperRef, setWrapperRef] = useState();

	useLayoutEffect(() => {
		if (!wrapperRef) return;
		const columnWidth = wrapperRef.clientWidth / 2;
		console.log(columnWidth);

	}, [wrapperRef])

	const fetchImages = useCallback((page) => {
		fetch(`${URL}?page=${page}&limit=${amount}`)
		.then(res => res.json())
		.then(data => setImages(images => [...images, ...data]))
		.catch(err => console.error(err));
	}, [])

	useEffect(() => {
		fetchImages(1);
	}, [fetchImages]);

	return <Wrapper ref={setWrapperRef}>
		<Column />
		<Column />
		<Column />
	</Wrapper>
});
