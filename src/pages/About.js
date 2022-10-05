import {memo} from "react";
import { Paragraph, Heading, Image } from 'grommet';
import styled from "styled-components";
import MePic from "../assets/Me.jpeg";

const BREAK_POINT = "991px";

const Wrapper = styled.div`
	width: 100%;
	display: flex;
	flex-direction: row;
	box-sizing: border-box;
	@media (max-width: ${BREAK_POINT}) {
		flex-direction: column;
	}
`;

const Header = styled.div`
	display: flex;
	flex-direction: column;
	width: 30%;
	box-sizing: border-box;
	align-items: center;

	@media(max-width: ${BREAK_POINT}) {
		width: 100%;
		flex-direction: row;
	}
`

const HeadImage = styled(Image)`
	width: 80%;
	margin: 36px 0;
	@media(max-width: ${BREAK_POINT}) {
		width: 40%;
		margin-right: 50px;
		flex-direction: row;
	}
`;

export const About = memo(() => {
	return <Wrapper>
		<Header>
			<HeadImage src={MePic} />
			<Heading level={2}>Hi, I'm Wei Yan</Heading>
		</Header>
		<div>
			<Paragraph size="xlarge">I'm a developer, and a WEB3 believer.</Paragraph>
			<Paragraph size="xlarge">I'm obsessed with tech, this blog is recording everything I learned and would like to share.</Paragraph>
			<Paragraph size="xlarge">If you are talking about study and improvement, then we are on the same page.</Paragraph>
			<Paragraph size="xlarge">Feel free to contact me through <a href="mailto: im.wayne.wy@gmail.com">E-Mail</a></Paragraph>
		</div>
	</Wrapper>
});
