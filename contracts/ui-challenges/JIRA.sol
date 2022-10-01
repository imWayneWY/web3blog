// SPDX-License-Identifier: GPL-3.0

pragma solidity  ^0.8.15;

contract JIRA {

	event AddTask(address recipient, uint taskId);
	event AssignTask(address assignee, uint taskId);

	enum Status { TODO, INPROGRESS, FINISH }
	struct Task {
		uint id;
		string title;
		string desc;
		address creator;
		address assignee;
		Status status;
	}
	Task[] private tasks;

	function addTask(string memory title, string memory desc) external {
		uint taskId = tasks.length;
		tasks.push(Task(taskId, title, desc, msg.sender, msg.sender, Status.TODO));
		emit AddTask(msg.sender, taskId);
	}
	function assign(uint id, address assignee) external {
		require(tasks.length > id, "Invalid task");
		tasks[id].assignee = assignee;
		emit AssignTask(assignee, id);
	}
	function setStatus(uint id, uint status) external {
		require(tasks.length > id, "Invalid task");
		require(tasks[id].assignee == msg.sender, "Not your task");
		if (status == 0) {
			tasks[id].status = Status.TODO;
		} else if (status == 1) {
			tasks[id].status = Status.INPROGRESS;
		} else if (status == 2) {
			tasks[id].status = Status.FINISH;
		}
	}
	function getAllTasks() external view returns (Task[] memory) {
		return tasks;
	}
}
