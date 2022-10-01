import { memo, useCallback, useState } from "react";
import styled from "styled-components";

// match with JIRA status
const Status = {
	TODO: 0,
	INPROGRESS: 1,
	FINISH: 2
};

const Wrapper = styled.div`
	width: 100%;
	height: 100%;
	position: relative;
`

const Columns = styled.div`
	display: flex;
	align-items: start;
	justify-content: space-between;
	height: 90%;
	overflow-y: scroll;
`;

const Header = styled(Columns)`
	justify-content: space-around;
	height: 10%;
`;

const Column = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: start;
	align-items: center;
	width: 30%;
	min-height: 100%;
	background: #ddd;
	box-sizing: border-box;
	padding: 10px;
`;


const CreateBtn = styled.button`
	border: none;
	width: 80px;
	height: 80px;
	position: absolute;
	bottom: 20px;
	right: 20px;
	border-radius: 50%;
	cursor: pointer;
	background: #999;
	color: white;
	box-shadow: 0 0 10px black;
`;

const CreatePanelWrapper = styled.div`
	position: absolute;
	top: 10px;
	right: 10px;
	left: 10px;
	bottom: 10px;
	background: white;
	padding: 20px;
	box-shadow: 0 0 10px black;
`;

const TitleInput = styled.input`
	width: 100%;
	height: 20px;
	font-size: 18px;
	line-height: 20px;
`;

const DescInput = styled.textarea`
	margin-top: 20px;
	width: 100%;
	height: 200px;
	font-size: 16px;
`;

const CreatePanel = memo(() => {
	return <CreatePanelWrapper>
		<h3>Create a ticket</h3>
		<TitleInput placeholder="input title here" />
		<DescInput placeholder="input description here" />
		<button>create</button>
	</CreatePanelWrapper>
});

export const Jira = memo(() => {
	const [isCreatePanelOpened, setIsCreatePanelOpened] = useState(false);
	const createTicket = useCallback(({
		title,
		desc
	}) => {
		setIsCreatePanelOpened(false);
	}, []);
	return <Wrapper>
		<Header>
			<h4>Todo</h4>
			<h4>In Progress</h4>
			<h4>Finish</h4>
		</Header>
		<Columns>
			<Column />
			<Column />
			<Column />
		</Columns>
		<CreateBtn onClick={() => setIsCreatePanelOpened(true)}>CREATE</CreateBtn>
		{ isCreatePanelOpened && <CreatePanel />}
	</Wrapper>
});
