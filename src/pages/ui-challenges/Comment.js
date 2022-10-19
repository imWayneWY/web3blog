import { ethers } from "ethers";
import { memo, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useWallet } from "../../hooks/useWallet";
import { CommentContractAddress } from "../../utils/address";
import CommentAbi from "../../abi/Comment.json";

const InputWrapper = styled.div`
	width: 100%;
	height: 100px;
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

const InputArea = styled.textarea`
	width: 80%;
	height: 100px;
`;

const SubmitBtn = styled.button`
	width: 15%;
	border-radius: 20px;
	height: 100px;
`;

const CommentInput = memo(({onSubmit, referId}) => {
	const [value, setValue] = useState("");
	const handleSubmit = useCallback(() => {
		onSubmit(value);
		setValue("");
	}, [onSubmit, value])
	return <InputWrapper>
		<InputArea value={value} onChange={(e) => setValue(e.currentTarget.value)} />
		<SubmitBtn onClick={handleSubmit}>Submit</SubmitBtn>
	</InputWrapper>
})

export const Comment = memo(() => {
	const [contract, setContract]  = useState();
	const [comments, setComments] = useState([]);
	const [referId, setReferId] = useState(0);
	const { signer } = useWallet();

	const initContract = useCallback(() => {
		if (!signer) return;
		const CommentContract = new ethers.Contract(
			CommentContractAddress,
			CommentAbi.abi,
			signer
		)
		setContract(CommentContract);
	}, [signer]);

	useEffect(() => {
		signer && initContract()
	}, [signer, initContract]);

	const getComments = useCallback(async () => {
		if (contract) {
			const list = await contract.listComments();
			setComments(list);
		}	
	}, [contract]);

	useEffect(() => {
		contract && getComments();
	}, [contract, getComments]);

	const submitComment = useCallback((content) => {
		if (!contract) return;
		contract.postComment(content, referId);
	}, [contract, referId])

	return <>
		<CommentInput onSubmit = {submitComment} referId={referId} />
	</>;
});