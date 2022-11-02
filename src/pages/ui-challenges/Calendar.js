import { ethers } from "ethers";
import { memo, useCallback, useEffect, useState, useMemo } from "react";
import styled, { css } from "styled-components";
import CalendarAbi from "../../abi/Calendar.json";
import { useWallet } from "../../hooks/useWallet";
import { CalendarContractAddress } from "../../utils/address";
import { AuthWrapper } from "../../components/AuthWrapper";

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

const NewEventInputWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	gap: 10px;
`;

const StartTimePicker = styled.input.attrs({
	type: "time"
})``;

const EndTimePicker = styled.input.attrs({
	type: "time"
})``;

const DescInput = styled.input`
	flex-grow: 1;
`;
const SubmintButton = styled.button``;

const Msg = styled.p`
	color: orange;
`;

const ItemsWrapper = styled.ul``;

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

const DayView = memo(({items, currentDay, contract}) => {
	const [startTime, setStartTime] = useState(currentDay.getHours()+":"+currentDay.getMinutes());
	const [endTime, setEndTime] = useState(currentDay.getHours()+":"+currentDay.getMinutes());
	const [desc, setDesc] = useState("");
	const [msg, setMsg] = useState("");
	const createEvent = useCallback((e) => {
		e.preventDefault();
		const trimedDescValue = desc.trim();
		if (!trimedDescValue) {
			setMsg("Please enter event desc");
			return;
		}
		if (contract) {
			const startTimeStamp = Number(new Date(currentDay.toDateString()+" "+startTime));
			const endTimeStamp = Number(new Date(currentDay.toDateString()+" "+endTime));
			if (isNaN(startTimeStamp) || isNaN(endTimeStamp) || endTimeStamp <= startTimeStamp) {
				setMsg("Invalid Time");
				return;
			}
			if (isConflict(items, startTimeStamp, endTimeStamp)) {
				setMsg("Conflict TIme");
				return;
			}
			contract.addEvent(trimedDescValue, startTimeStamp, endTimeStamp);
			setMsg("");
			setDesc("");
		}
	}, [desc, contract, currentDay, startTime, endTime, items]);

	useEffect(() => {
		const setError = () => setMsg("Add event failed");
		if (contract) {
			contract.on("EventFailed", setError);
			return () => {
				contract.off("EventFailed", setError);
			}	
		}
	})

	return <>
		<NewEventInputWrapper>
			<StartTimePicker value={startTime} onChange={e => setStartTime(e.currentTarget.value)}/>
			<EndTimePicker value={endTime} onChange={e => setEndTime(e.currentTarget.value)}/>
			<DescInput value={desc} onChange={e => setDesc(e.currentTarget.value)} />
			<SubmintButton onClick={createEvent}>Create</SubmintButton>
		</NewEventInputWrapper>
		{msg && <Msg>{msg}</Msg>}
		<ItemsWrapper>
			{
				items.map((item) => {
					const startTimeDate = new Date(item.startTime.toNumber());
					const endTimeDate = new Date(item.endTime.toNumber());

					return <li key={item.id}>{`${item.eventText}: from ${startTimeDate.toLocaleTimeString()} to ${endTimeDate.toLocaleTimeString()}`}</li>
				})
			}
		</ItemsWrapper>
	</>;
});

export const Calendar = memo(() => {
	const [contract, setContract] = useState();
	const [events, setEvents] = useState([]);
	const [currentDay, setCurrentDay] = useState(new Date(Date.now()));
	const [fullDays, setFullDays] = useState([]); // full days of a month
	const { signer } = useWallet();

	const getEvents = useCallback(async () => {
		const CalendarContract = new ethers.Contract(
			CalendarContractAddress,
			CalendarAbi.abi,
			signer
		)
		setContract(CalendarContract);
		const allEvents = await CalendarContract.getMyEvents();
		setEvents(allEvents);
	}, [signer]);

	useEffect(() => {
		signer && getEvents();
	}, [signer, getEvents]);

	useEffect(() => {
		setFullDays(getFullDays(currentDay));
	}, [currentDay]);


	useEffect(() => {
		if (contract) {
			contract.on("EventAdded", getEvents);
			return () => {
				contract.off("EventAdded", getEvents);
			}	
		}
	});

	const items = useMemo(() => currentDay ? events.filter(e => new Date(e.startTime.toNumber()).toDateString() === currentDay.toDateString()) : [], [currentDay, events]);

	return <AuthWrapper>
		<MonthView
			fulldays={fullDays}
			month={currentDay.getMonth()}
			currentDay={currentDay}
			setCurrentDay={setCurrentDay}
		/>
		<DayView items = {items} currentDay={currentDay} contract={contract} />
	</AuthWrapper>;
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

function isConflict(items, newStartTime, newEndTime) {
	for (let i=0; i<items.length; i++) {
		const {startTime, endTime} = items[i];
		if (
			(startTime < newStartTime && newStartTime < endTime)
			|| (startTime < newEndTime && newEndTime < endTime)
			|| (newStartTime < startTime && startTime < newEndTime)
			|| (newStartTime < endTime && endTime < newEndTime)
		) {
			return true;
		}
	}
	return false;
}