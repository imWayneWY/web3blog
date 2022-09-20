import { memo, useEffect, useState } from "react";
import styled, { css } from "styled-components";
import {Box} from "grommet";

const MonthGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(7, 1fr);
  	grid-template-rows: repeat(6, 1fr);
`;
const MonthItem = styled.div`
	${props => props.$day !== -1 && css`
		grid-column-start: ${props => props.$day + 1}	
	`}
`;

const WeekHeader = styled.div`
	display: grid;
	grid-template-columns: repeat(7, 1fr);
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

const MonthView = memo(({fulldays, month}) => {
	return <>
		<div>{MONTHS[month]}</div>
		<WeekHeader>
			{WEEKS.map(w => (<p key={w}>{w}</p>))}
		</WeekHeader>
		<MonthGrid>
			{fulldays.map(
				(day, idx) => (<MonthItem key={day} $day={idx === 0 ? day.getDay() : -1}>{day.getDate()}</MonthItem>)
			)}
		</MonthGrid>
	</>;
});

export const Calendar = memo(() => {
	const [currentDay, setCurrentDay] = useState(Date.now());
	const [fullDays, setFullDays] = useState([]); // full days of a month
	const [isMonthView, setIsMonthView] = useState(true);

	useEffect(() => {
		setFullDays(getFullDays(currentDay));
	}, [currentDay]);

	return <Box flex="grow">
		<MonthView fulldays={fullDays} month={new Date(currentDay).getMonth()} />
	</Box>;
});

function getFullDays(currentDay) {
	const currentDate = new Date(currentDay);
	const fullyear = currentDate.getFullYear();
	const month = currentDate.getMonth();

	const dates = new Date(fullyear, month + 1, 0).getDate();
	const fulldays = [];

	for (let i = 1; i <= dates; i++) {
		fulldays.push(new Date(fullyear, month, i));
	}
	return fulldays;
}