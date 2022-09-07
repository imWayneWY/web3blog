import { ethers } from "ethers";
import { memo, useState, useEffect, useCallback } from "react";
import { useWallet } from "../../hooks/useWallet";
import TasksAbi from "../../abi/Tasks.json";
import styled, { css } from "styled-components";

const TasksContractAddress = "0xF6E430c546b1DF82Eb524984DFeb7bb60396615e";

const Container = styled.div`
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	padding: 20px;
	font-size: 18px;
`;

const Input = styled.input`
	width: 600px;
	font-size: 24px;
`;

const Submit = styled.button`
	font-size: 18px;
	display: block;
	margin-top: 20px;
`;

const Msg = styled.p`
	color: orange;
`;

const CheckBox = styled.input.attrs({
	type: "checkbox"
})``;

const Title = styled.span`
	margin-left: 10px;
	${({$isDeleted}) => $isDeleted && css`
		text-decoration: line-through;
	`}
`;

export const Todo = memo(() => {
	const [contract, setContract] = useState();
	const [tasks, setTasks] = useState([]);
	const [value, setValue] = useState("");
	const [msg, setMsg] = useState("");
	const { signer } = useWallet();

	const getAllTasks = useCallback(async () => {
		const TasksContract = new ethers.Contract(
			TasksContractAddress,
			TasksAbi.abi,
			signer
		)
		setContract(TasksContract)
		const allTasks = await TasksContract.getMyTasks();
		setTasks(allTasks);
	}, [signer]);

	useEffect(() => {
		signer && getAllTasks();
	}, [getAllTasks, signer]);

	const addNewTask = useCallback((e) => {
		e.preventDefault();
		const trimedTaskValue = value.trim();
		if (!trimedTaskValue) {
			setMsg("Empty task cannot be added.")
			return;
		}
		if (contract) {
			contract.addTask(value);
			setValue("");
			setMsg("");
		}
	}, [contract, value]);

	useEffect(() => {
		if (contract) {
			contract.on("AddTask", getAllTasks);
			contract.on("DeleteTask", getAllTasks);
			return () => {
				contract.off("AddTask", getAllTasks);
				contract.off("DeleteTask", getAllTasks);
			};
		}
	}, [contract, getAllTasks]);

	const handleUpdate = useCallback((e) => {
		setValue(e.target.value);
	}, [])

	const deleteTask = useCallback((taksId) => {
		contract.deleteTask(taksId);
	}, [contract]);
	
	return <Container>
		{tasks.length
			? <ul>
				{tasks.map(task => <li key={task[0].toString()}>
					<CheckBox onChange={e => {
						task[3] && deleteTask(task[0]);
					}} defaultChecked={task[3]} readOnly={task[3]} disabled={task[3]}/>
					<Title $isDeleted={task[3]}>{task[2]}</Title>
				</li>)}
			</ul>
			: <p>Your tasks is empty.</p>}
		<Input placeholder="Enter you task here" onChange={handleUpdate} value={value} />
		<Submit onClick={addNewTask}>Submit</Submit>
		{msg && <Msg>{msg}</Msg>}
	</Container>;
});
