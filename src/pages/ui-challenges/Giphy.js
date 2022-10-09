import { memo, useCallback, useEffect, useState, useLayoutEffect } from "react";
import styled from "styled-components";
import { Spinner } from "grommet";
import { Refresh } from "grommet-icons";
import { useNavigate } from "react-router-dom";

const Wrapper = styled.div`
	width: 100%;
	min-height: 100vh;
	display: flex;
`;

const Column = styled.div`
	flex: 1;
	position: relative;
`;

const ImageWrapper = styled.div`
	position: absolute;
	top: ${props => props.top}px;
	left: 10px;
	width: calc(100% - 20px);
	height: ${props => props.height}px;
`;
const Image = styled.img`
	display: ${props => props.loaded ? "block" : "none"};
	width: 100%;
	border-radius: 20px;
`;

const LoadingWrapper = styled.div`
	width: 100%;
	height: 100%;
	border-radius: 20px;
	background: #ccc;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const RefreshBtn = styled.div`
	position: fixed;
	right: 20px;
	bottom: 20px;
	width: 60px;
	height: 60px;
	border-radius: 30px;
	z-index: 100;
	box-shadow: 0 0 10px black;
	background: grey;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
`;

const URL = "https://picsum.photos/v2/list";
const amount = 20;

export const Giphy = memo(() => {
	const [images, setImages] = useState([]);
	const [col0Images, setCol0Images] = useState([]);
	const [col1Images, setCol1Images] = useState([]);
	const [col2Images, setCol2Images] = useState([]);
	const [wrapperRef, setWrapperRef] = useState();
	const [columnWidth, setColumnWidth] = useState(0);

	const navigate = useNavigate();

	useLayoutEffect(() => {
		if (!wrapperRef) return;
		setColumnWidth(wrapperRef.clientWidth / 3 - 20);
	}, [wrapperRef])

	const fetchImages = useCallback(() => {
		const randomPage = Math.round(Math.random() * 50)
		fetch(`${URL}?page=${randomPage}&limit=${amount}`)
		.then(res => res.json())
		.then(data => setImages(images => [...data]))
		.catch(err => console.error(err));
	}, [])

	useEffect(() => {
		fetchImages();
	}, [fetchImages]);

	useEffect(() => {
		if (!images.length || !columnWidth) return;
		const layoutImages = () => {
			const heights = [10,10,10];
			const columnImgs = [[], [], []];

			const getShortestHeight = () => {
				let min = Infinity;
				let minIdx = -1;
				for (let i=0; i<3; i++) {
					if (heights[i] < min) {
						min = heights[i];
						minIdx = i;
					}
				}
				return [minIdx, min];
			}

			for (let i=0; i<images.length; i++) {
				const image = images[i];
				const [shortestHeightIdx, shortestHeight] = getShortestHeight();
				const imgHeight = columnWidth / (images[i].width / images[i].height);
				const newImg = {
					...image,
					top: shortestHeight+10,
					height: imgHeight
				}
				heights[shortestHeightIdx] = shortestHeight + 10 + imgHeight;

				columnImgs[shortestHeightIdx].push(newImg);
			}
			setCol0Images(columnImgs[0]);
			setCol1Images(columnImgs[1]);
			setCol2Images(columnImgs[2]);
		}
		layoutImages()
	}, [columnWidth, images]);

	return <Wrapper ref={setWrapperRef}>
		<Column id="col0">
			{
				col0Images.map((img, idx) => <LoadImg key={idx} src={img.download_url} top={img.top} height={img.height} />)
			}
		</Column>
		<Column id="col1">
			{
				col1Images.map((img, idx) => <LoadImg key={idx} src={img.download_url} top={img.top} height={img.height} />)
			}
		</Column>
		<Column id="col2" >
			{
				col2Images.map((img, idx) => <LoadImg key={idx} src={img.download_url} top={img.top} height={img.height} />)
			}
		</Column>
		<RefreshBtn onClick={() => navigate(0)}>
			<Refresh color="white" />
		</RefreshBtn>
	</Wrapper>
});

const LoadImg = memo(({src, top, height}) => {
	const [loaded, setLoaded] = useState(false);
	return <ImageWrapper  top={top}  height={height}>
		{!loaded && <Loading/>}
		<Image src={src} onLoad={() => setLoaded(true)} loaded={loaded} />
	</ImageWrapper>
})

const Loading = () => (
	<LoadingWrapper>
		<Spinner />
	</LoadingWrapper>
);
