// SPDX-License-Identifier: GPL-3.0

pragma solidity  ^0.8.15;

contract CalendarContract {
	
	event EventAdded(address recipient, uint eventId);
	event EventFailed(address recipinet, uint eventId);

	struct CalendarEvent {
		uint id;
		address username;
		string eventText;
		uint startTime;
		uint endTime;
	}

	CalendarEvent[] private events;

	function _getEvents(address owner) internal view returns (CalendarEvent[] memory) {
		CalendarEvent[] memory temporary = new CalendarEvent[](events.length);
		uint counter = 0;
		for (uint i=0; i<events.length; i++) {
			if (events[i].username == owner) {
				temporary[counter] = events[i];
				counter++;
			}
		}
        CalendarEvent[] memory result = new CalendarEvent[](counter);
        for(uint i=0; i<counter; i++) {
            result[i] = temporary[i];
        }
        return result;
	}

	// shoot, typo here
	function _isConfict(uint startTime1, uint startTime2, uint endTime1, uint endTime2) internal pure returns (bool) {
		if (
			(startTime1 > startTime2 && startTime1 < endTime2)
			|| (endTime1 > startTime2 && endTime1 < endTime2)
			|| (startTime2 > startTime1 && startTime2 < endTime1)
			|| (endTime2 > startTime1 && endTime2 < endTime1)
		) {
			return true;
		}
		return false;
	}

	function addEvent(string memory eventText, uint startTime, uint endTime) external {
		uint eventId = events.length;
		CalendarEvent[] memory myEvents = _getEvents(msg.sender);
		bool isValid = true;
		for (uint i=0; i<myEvents.length; i++) {
			if (_isConfict(myEvents[i].startTime, startTime, myEvents[i].endTime, endTime)) {
				isValid = false;
				emit EventFailed(msg.sender, eventId);
				break;
			}
		}
		if (isValid) {
			events.push(CalendarEvent(eventId, msg.sender, eventText, startTime, endTime));
			emit EventAdded(msg.sender, eventId);
		}
	}

	function getMyEvents() external view returns (CalendarEvent[] memory) {
		return _getEvents(msg.sender);
	}
}