import { ethers } from "ethers";
import { memo, useCallback, useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import { useWallet } from "../../hooks/useWallet";
import { CommentContractAddress } from "../../utils/address";
import CommentAbi from "../../abi/Comment.json";
import { AuthWrapper } from "../../components/AuthWrapper";

const InputWrapper = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

const InputArea = styled.textarea`
	box-sizing: border-box;
	width: 80%;
	height: 100px;
`;

const SubmitBtn = styled.button`
	width: 15%;
	border-radius: 20px;
	height: 100px;
`;

const CommentWrapper = styled.div`
	user-select: none;
	cursor: pointer;
	width: 100%;
	margin: 20px 0;
	border-radius: 20px;
	padding: 20px;
	box-sizing: border-box;
	box-shadow: 0 0 10px black;
	p {
		margin: 0;
		margin-bottom: 10px;
	}
`;

const CommentHeader = styled.div`
	display: flex;
	justify-content: space-between;
	p {
		font-size: 12px;
		margin: 0;
	}
	padding-bottom: 10px;
	margin-bottom: 10px;
	border-bottom: 1px gray solid;
`;
const ReferWrapper = styled.div`
	width: 100%;
	background: #ffff99;
	border-radius: 5px;
	box-sizing: border-box;
	padding: 10px;
	p {
		margin: 0;
		font-size: 10px;
	}
`;

const ReferInputWrapper = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	margin-bottom: 10px;
`;

const InfoWrapper = styled.div`
	width: 70%;
`;

const HeadWrapper = styled.div`
	width: 20%;
	p {
		margin: 0;
		font-size: 12px;
	}
`;

const ReferInfo = memo(({ content, postTime, author }) => {
	return <ReferWrapper>
		<p>{content}</p>
		<p>by {simpleAddress(author)} on {getDateString(postTime)}</p>
	</ReferWrapper>
})

const ReferInfoInput = memo(({ content, postTime, author, clearRefer }) => {
	return <ReferInputWrapper>
		<HeadWrapper>
			<p>refer from:</p>
			<button onClick={clearRefer}>clear</button>
		</HeadWrapper>
		<InfoWrapper>
			<ReferInfo content={content} postTime={postTime} author={author} />
		</InfoWrapper>
	</ReferInputWrapper>
})

const CommentInput = memo(({ onSubmit, referInfo, clearRefer }) => {
	const [value, setValue] = useState("");
	const handleSubmit = useCallback(() => {
		onSubmit(value);
		setValue("");
	}, [onSubmit, value])
	return <>
		{
			!!referInfo && <ReferInfoInput content={referInfo.content} author={referInfo.author} postTime={referInfo.postTime} clearRefer={clearRefer} />
		}
		<InputWrapper $hasRefer={!!referInfo}>
			<InputArea value={value} onChange={(e) => setValue(e.currentTarget.value)} >
			</InputArea>
			<SubmitBtn onClick={handleSubmit}>Submit</SubmitBtn>
		</InputWrapper>
	</>
})



const CommentItem = memo(({ item, setReferId }) => {
	return <CommentWrapper onClick={() => setReferId(item.id)}>
		<CommentHeader>
			<p>{simpleAddress(item.author)} :</p>
			<p>{getDateString(item.postTime)}</p>
		</CommentHeader>
		<p>{item.content}</p>
		{
			item.referId.toNumber() > 0 && <ReferInfo content={item.referContent} postTime={item.referPostTime} author={item.referAuthor} />
		}
	</CommentWrapper>
})

const CommentList = memo(({ list, setReferId }) => {
	return <div>
		{list.map(item =>
			<CommentItem key={item.id} item={item} setReferId={setReferId} />
		)}
	</div>
});

export const Comment = memo(() => {
	const [contract, setContract] = useState();
	const [comments, setComments] = useState([]);
	const [referId, setReferId] = useState(0);
	const { signer } = useWallet();

	const referInfo = useMemo(() => {
		const res = comments.filter(comment => comment.id.eq(referId));
		return res.length ? res[0] : null;
	}, [comments, referId]);

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

	useEffect(() => {
		if (contract) {
			contract.on("AddComment", getComments);
			return () => contract.off("AddComment", getComments);
		}
	});

	return <AuthWrapper>
		<CommentInput onSubmit={submitComment} referInfo={referInfo}  clearRefer={() => setReferId(0)} />
		<CommentList list={comments} setReferId={setReferId}/>
	</AuthWrapper>;
});

function getDateString(time) {
	let date = new Date(time?.toNumber() * 1000);
	return date.toLocaleString();
}
function simpleAddress(address) {
	return "0x..." + address?.substring(address.length - 4);
}