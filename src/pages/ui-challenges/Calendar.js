import { memo, useEffect, useState } from "react";
import styled, { css } from "styled-components";
import {Box} from "grommet";

const MonthHeader = styled.h2`
	text-align: center;
`;

const MonthGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(7, 1fr);
  	grid-template-rows: repeat(6, 1fr);
	grid-gap: 6px;
`;

const HeaderItem = styled.div`
	height: 50px;
	line-height: 50px;
	text-align: center;
	background: grey;
`;
const MonthItem = styled.div`
	${props => props.$day !== -1 && css`
		grid-column-start: ${props => props.$day + 1};
	`}
	${props => props.$isCurrentDay && css`
		background: green;
	`}
	border: 2px grey solid;
	border-radius: 10px;
	text-align: center;
	height: 40px;
	line-height: 40px;
	cursor: pointer;
`;

const WeekHeader = styled.div`
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	margin: 20px 0;
`;

const MONTHS = [
	"JAN",
	"FEB",
	"MAR",
	"APR",
	"MAY",
	"JUN",
	"JUL",
	"AUG",
	"SEP",
	"OCT",
	"NOV",
	"DEC"
]

const WEEKS = [
	"SUN",
	"MON",
	"TUE",
	"WED",
	"THU",
	"FRI",
	"SAT",
]

const MonthView = memo(({fulldays, month, currentDay, setCurrentDay}) => {
	return <>
		<MonthHeader>{MONTHS[month]}</MonthHeader>
		<WeekHeader>
			{WEEKS.map(w => (<HeaderItem key={w}>{w}</HeaderItem>))}
		</WeekHeader>
		<MonthGrid>
			{fulldays.map(
				(day, idx) => (<MonthItem
					key={day}
					$day={idx === 0 ? day.getDay() : -1}
					$isCurrentDay={currentDay.getDate()===day.getDate()}
					onClick={() => setCurrentDay(day)}
				>
					{day.getDate()}
				</MonthItem>)
			)}
		</MonthGrid>
	</>;
});

export const Calendar = memo(() => {
	const [currentDay, setCurrentDay] = useState(new Date(Date.now()));
	const [fullDays, setFullDays] = useState([]); // full days of a month
	const [isMonthView, setIsMonthView] = useState(true);

	useEffect(() => {
		setFullDays(getFullDays(currentDay));
	}, [currentDay]);

	return <Box flex="grow" pad="medium">
		<MonthView fulldays={fullDays} month={currentDay.getMonth()} currentDay={currentDay} setCurrentDay={setCurrentDay}/>
	</Box>;
});

function getFullDays(currentDay) {
	const fullyear = currentDay.getFullYear();
	const month = currentDay.getMonth();

	const dates = new Date(fullyear, month + 1, 0).getDate();
	const fulldays = [];

	for (let i = 1; i <= dates; i++) {
		fulldays.push(new Date(fullyear, month, i));
	}
	return fulldays;
}