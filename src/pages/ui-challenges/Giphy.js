import { memo, useCallback, useEffect, useState, useLayoutEffect } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
	width: 100%;
	min-height: 100vh;
	display: flex;
`;

const Column = styled.div`
	flex: 1;
	position: relative;
`;

const Image = styled.img`
	position: absolute;
	left: 10px;
	width: calc(100% - 20px);
	top: ${props => props.top}px;
`;
const URL = "https://picsum.photos/v2/list";
const amount = 50;

export const Giphy = memo(() => {
	const [images, setImages] = useState([]);
	const [col1Images, setCol1Images] = useState([]);
	const [col2Images, setCol2Images] = useState([]);
	const [col3Images, setCol3Images] = useState([]);
	const [wrapperRef, setWrapperRef] = useState();
	const [columnWidth, setColumnWidth] = useState(0);

	useLayoutEffect(() => {
		if (!wrapperRef) return;
		setColumnWidth(wrapperRef.clientWidth / 3 - 20);
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

	useEffect(() => {
		console.warn(columnWidth)
		if (!images.length || !columnWidth) return;
		console.log(images[0]);
		console.log(columnWidth);
		
		const img1height = columnWidth / (images[0].width / images[0].height);
		console.warn(img1height);
		const top2 = img1height + 10;
		setCol1Images([{...images[0], top: 0}, {...images[1], top: top2}]);

	}, [columnWidth, images]);

	return <Wrapper ref={setWrapperRef}>
		<Column id="col0">
			{
				col1Images.map(img => <Image src ={img.download_url} top={img.top}/>)
			}
		</Column>
		<Column id="col1" />
		<Column id="col2" />
	</Wrapper>
});
