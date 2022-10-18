import { memo } from "react";
import styled from "styled-components";

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
	return <>
		<CommentInput />
	</>;
});