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

const TaskDetailPanel = styled(CreatePanelWrapper)``;

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

const CardWrapper = styled.div.attrs({
	draggable: "true"
})`
	width: 100%;
	height: 120px;
	border-radius: 10px;
	background: #fff;
	padding: 10px;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	cursor: move;
`;

const CardTitle = styled.h4`
	width: 100%;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	margin: 0;
	user-select: none;
`;

const Assignee = styled.p`
	font-size: 12px;
	user-select: none;
`;

const CloseBtn = styled.div`
	cursor: pointer;
	position: absolute;
	right: 20px;
	top: 20px;
	padding: 10px;
`;

const CardDesc = styled.p`
	margin-top: 40px;
`

const CreatePanel = memo(({onCreate, onClose}) => {
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
		<CloseBtn onClick={onClose}>X</CloseBtn>
	</CreatePanelWrapper>
});

const TaskCard = memo(({task, handleClick}) => {
	// todo: implement assign function with contract.assign(uint id, address assignee)
	return <CardWrapper onClick={handleClick} onDragStart={(ev) => {
		ev.dataTransfer.setData("text/plain", task.id);
	}}>
		<CardTitle>{task.title}</CardTitle>
		<Assignee>assignee: 0x...{task.assignee.substring(task.assignee.length - 4)}</Assignee>
	</CardWrapper>
})

const TaskDetail = memo(({task, onClose}) => {
	return <TaskDetailPanel>
		<CardTitle>{task.title}</CardTitle>
		<Assignee>creator: 0x...{task.assignee.substring(task.creator.length - 4)}</Assignee>
		<Assignee>assignee: 0x...{task.assignee.substring(task.assignee.length - 4)}</Assignee>
		<Assignee>Status: {getStatus(task.status)}</Assignee>
		<CardDesc>{task.desc}</CardDesc>
		<CloseBtn onClick={onClose}>X</CloseBtn>
	</TaskDetailPanel>
});
export const Jira = memo(() => {
	const [isCreatePanelOpened, setIsCreatePanelOpened] = useState(false);
	const [contract, setContract] = useState();
	const { signer }  = useWallet();
	const [tasks, setTasks] = useState([]);
	const [viewTask, setViewTask] = useState(null);

	const getAllTasks = useCallback(async () => {
		const JiraContract = new ethers.Contract(
			JiraContractAddress,
			JiraAbi.abi,
			signer
		)
		setContract(JiraContract);
		const allTasks = await JiraContract.getAllTasks();
		setTasks(allTasks.map((task) => ({...task, isDragging: false})));
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

	const allowDragOver = useCallback((e) => e.preventDefault(), []);
	const setStatus = useCallback((ev, status) => {
		ev.preventDefault();
		const id = ev.dataTransfer.getData("text/plain");
		const targetTask = tasks.filter((task) => task.id.eq(id))[0];
		if (status === targetTask.status) return;
		if (contract) {
			contract.setStatus(targetTask.id, status);
			targetTask.status = status;
			setTasks(tasks => tasks.map(task => task.id.eq(targetTask.id) ? targetTask : task));
		}
	}, [tasks, contract]);

	return <Wrapper>
		<Header>
			<h4>Todo</h4>
			<h4>In Progress</h4>
			<h4>Finish</h4>
		</Header>
		<Columns>
			<Column onDragOver={allowDragOver} onDrop={(e) => setStatus(e, Status.TODO)}>
				{
					tasks.filter(task => task.status === Status.TODO && !task.isDragging).map((task) => <TaskCard key={task.id} task={task} handleClick={() => setViewTask(task)} />)
				}
			</Column>
			<Column onDragOver={allowDragOver} onDrop={(e) => setStatus(e, Status.INPROGRESS)}>
				{
					tasks.filter(task => task.status === Status.INPROGRESS && !task.isDragging).map((task) => <TaskCard key={task.id} task={task} handleClick={() => setViewTask(task)} />)
				}
			</Column>
			<Column onDragOver={allowDragOver} onDrop={(e) => setStatus(e, Status.FINISH)}>
				{
					tasks.filter(task => task.status === Status.FINISH && !task.isDragging).map((task) => <TaskCard key={task.id} task={task} handleClick={() => setViewTask(task)} />)
				}
			</Column>
		</Columns>
		<CreateBtn onClick={() => setIsCreatePanelOpened(true)}>CREATE</CreateBtn>
		{ isCreatePanelOpened && <CreatePanel onCreate={createTicket} onClose={() => setIsCreatePanelOpened(false)} />}
		{ !!viewTask && <TaskDetail task={viewTask} onClose={() => setViewTask(null)}/>}
	</Wrapper>
});


function getStatus(status) {
	switch (status) {
		case Status.TODO:
			return "Todo";
		case Status.INPROGRESS:
			return "In Progress";
		case Status.FINISH:
			return "Finish";
		default:
			return "Unknown";
	}
}