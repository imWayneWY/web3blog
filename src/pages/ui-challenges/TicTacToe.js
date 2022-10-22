import { memo, useCallback, useState } from "react";
import styled, { css } from "styled-components";

const TicTacToeWrapper = styled.div`
	width: 100%;
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
`;

const Board = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-template-rows: repeat(3, 1fr);
	grid-gap: 10px;
	font-size: 60px;
	border-radius: 20px;
	background: grey;
	border: 2px solid grey;
	padding: 10px;
`;

const Spot = styled.div`
	width: 100px;
	height: 100px;
	line-height: 100px;
	text-align: center;
	border-radius: 20px;
	background: white;
	${props => props.hasPiece && css`
		pointer-events: none;
	`}
`;

const Banner = styled.div`
	position: absolute;
	left: 20px;
	right: 20px;
	top: 20px;
	height: 100px;
	background: #7FDBFF;
	border-radius: 20px;
	font-size: 70px;
	line-height: 100px;
	text-align: center;
`;

const ClearButton = styled.div`
	border-radius: 50%;
	width: 80px;
	height: 80px;
	position: absolute;
	top: 10px;
	right: 20px;
	font-size: 20px;
	line-height: 80px;
	background: #39CCCC;
	user-select: none;
	cursor: pointer;
	color: white;
`;

const DifficultySwitch = styled.div`
	margin-top: 30px;
	background: ${props => props.$difficulty === "EASY" ? "#01FF70" : "#FF4136"};
	height: 60px;
	width: 120px;
	border-radius: 10px;
	user-select: none;
	cursor: pointer;	
	font-size: 40px;
	line-height: 60px;
	text-align: center;
	color: white;
`;

const INIT_STATE = [
	["", "", ""],
	["", "", ""],
	["", "", ""],
]

const WinnerBanner = memo(({winner, reset}) => {
	return <Banner>
		{winner !== "TIE" ? `Winner is ${winner}` : winner}
		<ClearButton onClick={reset}>retry</ClearButton>
	</Banner>
})

const TicTacToeBoard = memo(({state, placePiece, difficulty, switchDifficulty}) => {
	const handleClick = useCallback((idx) => {
		const row = Math.floor(idx / 3);
		const col = idx % 3;
		placePiece(row, col);
	}, [placePiece]);
	return <TicTacToeWrapper>
		<Board>
			{
				state.flat().map((s, idx) => {
					return <Spot key={idx} onClick={() => handleClick(idx)} hasPiece={!!s}>{s}</Spot>;
				})
			}
		</Board>
		<DifficultySwitch $difficulty={difficulty} onClick={switchDifficulty}>{difficulty}</DifficultySwitch>
	</TicTacToeWrapper>
})

export const TicTacToe = memo(() => {
	const [state, setState] = useState(INIT_STATE);
	const [winner, setWinner] = useState("");
	const [difficulty, setDifficulty] = useState("EASY");

	const placePiece = useCallback((row, col) => {
		if (!!winner) return;
		const newState = [...state.map(arr => [...arr])];
		const checkWinner = () => {
			if (newState[0][0] && newState[0][0] === newState[1][1] && newState[0][0] === newState[2][2]) {
				setWinner(newState[0][0]);
				return true;
			}
			if (newState[2][0] && newState[2][0] === newState[1][1] && newState[2][0] === newState[0][2]) {
				setWinner(newState[2][0]);
				return true;
			}
			let cnt = 0;
			for (let i=0; i<3; i++) {
				if (newState[i][0] && newState[i][0] === newState[i][1] && newState[i][1] === newState[i][2]) {
					setWinner(newState[i][0]);
					return true;
				}
				if (newState[0][i] && newState[0][i] === newState[1][i] && newState[1][i] === newState[2][i]) {
					setWinner(newState[0][i]);
					return true;
				}
				for (let j=0; j<3; j++) {
					if (newState[i][j]) {
						cnt++;
					}
				}
				if (cnt ===9) {
					setWinner("TIE");
					return true;
				}
			}
			return false;
		}
		newState[row][col] = 'X';
		setState(newState);

		if (checkWinner()) return;
		const cpuPlacePiece = () => {
			let r = Math.floor(Math.random() * 3);
			let c = Math.floor(Math.random() * 3);
			while(newState[r][c]) {
				r = Math.floor(Math.random() * 3);
				c = Math.floor(Math.random() * 3);
			}
			newState[r][c] = 'O';
			setState(newState);
		}

		const cpuPlacePieceSmartly = () => {
			if (newState[0][0]==='O' && newState[0][0] === newState[1][1] && !newState[2][2]) {
				newState[2][2] = 'O';
				setState(newState);
				return;
			}
			if (newState[0][0]==='O' && newState[0][0] === newState[2][2] && !newState[1][1]) {
				newState[1][1] = 'O';
				setState(newState);
				return;
			}
			if (newState[1][1]==='O' && newState[1][1] === newState[2][2] && !newState[0][0]) {
				newState[0][0] = 'O';
				setState(newState);
				return;
			}
			if (newState[1][1]==='O' && newState[2][0] === newState[1][1] && !newState[0][2]) {
				newState[0][2] = 'O';
				setState(newState);
				return;
			}
			if (newState[2][0]==='O' && newState[2][0] === newState[0][2] && !newState[1][1]) {
				newState[1][1] = 'O';
				setState(newState);
				return;
			}
			if (newState[1][1]==='O' && newState[1][1] === newState[0][2] && !newState[2][0]) {
				newState[2][0] = 'O';
				setState(newState);
				return;
			}
			for (let i=0; i<3; i++) {
				if (newState[i][0]==='O' && newState[i][0] === newState[i][1] && !newState[i][2]) {
					newState[i][2] = 'O';
					setState(newState);
					return;
				}
				if (newState[i][0]==='O' && newState[i][0] === newState[i][2] && !newState[i][1]) {
					newState[i][1] = 'O';
					setState(newState);
					return;
				}
				if (newState[i][2]==='O' && newState[i][2] === newState[i][1] && !newState[i][0]) {
					newState[i][0] = 'O';
					setState(newState);
					return;
				}

				if (newState[0][i]==='O' && newState[0][i] === newState[1][i] && !newState[2][i]) {
					newState[2][i] = 'O';
					setState(newState);
					return;
				}
				if (newState[0][i]==='O' && newState[0][i] === newState[2][i] && !newState[1][i]) {
					newState[1][i] = 'O';
					setState(newState);
					return;
				}
				if (newState[2][i]==='O' && newState[2][i] === newState[1][i] && !newState[0][i]) {
					newState[0][i] = 'O';
					setState(newState);
					return;
				}
			}
			if (newState[0][0]==='X' && newState[0][0] === newState[1][1] && !newState[2][2]) {
				newState[2][2] = 'O';
				setState(newState);
				return;
			}
			if (newState[0][0]==='X' && newState[0][0] === newState[2][2] && !newState[1][1]) {
				newState[1][1] = 'O';
				setState(newState);
				return;
			}
			if (newState[1][1]==='X' && newState[1][1] === newState[2][2] && !newState[0][0]) {
				newState[0][0] = 'O';
				setState(newState);
				return;
			}
			if (newState[1][1]==='X' && newState[2][0] === newState[1][1] && !newState[0][2]) {
				newState[0][2] = 'O';
				setState(newState);
				return;
			}
			if (newState[2][0]==='X' && newState[2][0] === newState[0][2] && !newState[1][1]) {
				newState[1][1] = 'O';
				setState(newState);
				return;
			}
			if (newState[1][1]==='X' && newState[1][1] === newState[0][2] && !newState[2][0]) {
				newState[2][0] = 'O';
				setState(newState);
				return;
			}
			for (let i=0; i<3; i++) {
				if (newState[i][0]==='X' && newState[i][0] === newState[i][1] && !newState[i][2]) {
					newState[i][2] = 'O';
					setState(newState);
					return;
				}
				if (newState[i][0]==='X' && newState[i][0] === newState[i][2] && !newState[i][1]) {
					newState[i][1] = 'O';
					setState(newState);
					return;
				}
				if (newState[i][2]==='X' && newState[i][2] === newState[i][1] && !newState[i][0]) {
					newState[i][0] = 'O';
					setState(newState);
					return;
				}

				if (newState[0][i]==='X' && newState[0][i] === newState[1][i] && !newState[2][i]) {
					newState[2][i] = 'O';
					setState(newState);
					return;
				}
				if (newState[0][i]==='X' && newState[0][i] === newState[2][i] && !newState[1][i]) {
					newState[1][i] = 'O';
					setState(newState);
					return;
				}
				if (newState[2][i]==='X' && newState[2][i] === newState[1][i] && !newState[0][i]) {
					newState[0][i] = 'O';
					setState(newState);
					return;
				}
			}
			if (!newState[1][1]) {
				newState[1][1] = 'O';
				setState(newState);
				return;
			}
			if (!newState[0][0] || !newState[0][2] || !newState[2][0] || !newState[2][2]) {
				const connerArr = [[0,0], [0,2], [2,0], [2,2]];
				let tryPlace = Math.floor(Math.random() * 4);
				while(newState[connerArr[tryPlace][0]][connerArr[tryPlace][1]]) {
					tryPlace = Math.floor(Math.random() * 4);
				}
				newState[connerArr[tryPlace][0]][connerArr[tryPlace][1]] = 'O';
				setState(newState);
				return;
			}
			cpuPlacePiece();
		}

		if (difficulty === "EASY") {
			cpuPlacePiece();
		} else {
			cpuPlacePieceSmartly();
		}
		checkWinner();
	}, [state, winner, difficulty]);

	const reset = useCallback(() => {
		setState([...INIT_STATE]);
		setWinner("");
	})

	return <>
		{winner && <WinnerBanner winner={winner} reset={reset}/>}
		<TicTacToeBoard state={state} placePiece={placePiece} switchDifficulty={() => setDifficulty(diff => diff === "EASY" ? "HARD" : "EASY")} difficulty={difficulty}/>
	</>;
});
