import { memo, useCallback, useState, useEffect } from "react";
import styled from "styled-components";
import { JiraContractAddress } from "../../utils/address";
import { useWallet } from "../../hooks/useWallet";
import { ethers } from "ethers";
import JiraAbi from "../../abi/JIRA.json";

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

const CreatePanel = memo(({onCreate}) => {
	const [title, setTitle] = useState("");
	const [desc, setDesc] = useState("");

	const handleClick = useCallback(() => {
		const trimedTitle = title.trim();
		const trimedDesc = desc.trim();
		if (!trimedTitle || !trimedDesc) return;
		onCreate(trimedTitle, trimedDesc);
	}, [title, desc, onCreate]);

	return <CreatePanelWrapper>
		<h3>Create a ticket</h3>
		<TitleInput placeholder="input title here" value={title} onChange={e => setTitle(e.currentTarget.value)}/>
		<DescInput placeholder="input description here"  value={desc} onChange={e => setDesc(e.currentTarget.value)}/>
		<button onClick={handleClick}>create</button>
	</CreatePanelWrapper>
});

export const Jira = memo(() => {
	const [isCreatePanelOpened, setIsCreatePanelOpened] = useState(false);
	const [contract, setContract] = useState();
	const { signer }  = useWallet();
	const [tasks, setTasks] = useState([]);

	const getAllTasks = useCallback(async () => {
		const JiraContract = new ethers.Contract(
			JiraContractAddress,
			JiraAbi.abi,
			signer
		)
		setContract(JiraContract);
		const allTasks = await JiraContract.getAllTasks();
		console.log(allTasks);
		setTasks(allTasks);
	}, [signer])

	const createTicket = useCallback((
		title,
		desc
	) => {
		if (!contract) return;
		contract.addTask(title, desc);
		setIsCreatePanelOpened(false);
	}, [contract]);

	useEffect(() => {
		signer && getAllTasks();
	}, [getAllTasks, signer])
	
	useEffect(() => {
		if (contract) {
			contract.on("AddTask", getAllTasks);
			return () => contract.off("AddTask", getAllTasks);
		}
	}, [contract, getAllTasks]);
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
		{ isCreatePanelOpened && <CreatePanel onCreate={createTicket} />}
	</Wrapper>
});
