import { memo, useCallback, useEffect, useState } from "react";
import styled, { css } from "styled-components";

const MonthHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
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

const MonthTitle = styled.h2`
	margin: 0;
`;
const YearTitle = styled.h2`
	margin: 0;
`;

const MonthSelector = styled.span`
	font-size: 30px;
	font-weight: bolder;
	width: 30%;
	text-align: center;
	cursor: pointer;
	user-select: none;
`;

const PrevMonth = styled(MonthSelector)``;
const NextMonth = styled(MonthSelector)``;

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
	const selectPrevMonth = useCallback(() => {
		const month = currentDay.getMonth();
		if (month === 0) {
			const year = currentDay.getFullYear() - 1;
			setCurrentDay(new Date(year, 11, 1));
		} else {
			setCurrentDay(new Date(currentDay.getFullYear(), month-1, 1));
		}
	}, [setCurrentDay, currentDay]);

	const selectNextMonth = useCallback(() => {
		const month = currentDay.getMonth();
		if (month === 11) {
			const year = currentDay.getFullYear() + 1;
			setCurrentDay(new Date(year, 0, 1));
		} else {
			setCurrentDay(new Date(currentDay.getFullYear(), month+1, 1));
		}
	}, [setCurrentDay, currentDay]);
	return <>
		<MonthHeader>
			<PrevMonth onClick={selectPrevMonth}>{"<"}</PrevMonth>
			<MonthTitle>{MONTHS[month]}</MonthTitle>
			<YearTitle>{currentDay.getFullYear()}</YearTitle>
			<NextMonth onClick={selectNextMonth}>{">"}</NextMonth>
		</MonthHeader>
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

const DayView = memo(() => {
	return <></>;
});

export const Calendar = memo(() => {
	const [currentDay, setCurrentDay] = useState(new Date(Date.now()));
	const [fullDays, setFullDays] = useState([]); // full days of a month

	useEffect(() => {
		setFullDays(getFullDays(currentDay));
	}, [currentDay]);

	return <>
		<MonthView
			fulldays={fullDays}
			month={currentDay.getMonth()}
			currentDay={currentDay}
			setCurrentDay={setCurrentDay}
		/>
		<DayView items = {[]} />
	</>;
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