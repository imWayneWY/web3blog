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

const CommentInput = memo(() => {
	return <InputWrapper>
		<InputArea />
		<SubmitBtn>Submit</SubmitBtn>
	</InputWrapper>
})

export const Comment = memo(() => {
	const [contract, setContract]  = useState();
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

	return <>
		<CommentInput />
	</>;
});