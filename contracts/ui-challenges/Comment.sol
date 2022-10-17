// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.15;

contract CommentContract {
	struct Comment {
		uint id;
		address author;
		string content;
		uint postTime;
        uint referId;
	}

    struct OutputComment {
        uint id;
        address author;
        string content;
        uint postTime;
        address referAuthor;
        bytes32 referBriefContent;
        uint referPostTime;
        uint likes;
    }

	Comment[] private comments;
    uint[] private likes;

    constructor() {
        // This is meaningless comment, just for comment without refer to point
        comments.push(Comment(0, msg.sender, "HelloWorld", block.timestamp, 0));
        likes.push(0);
    }

    function postComment(string memory content, uint referId) external {
        require(referId < comments.length, "Invalid referId");
        uint commentId = comments.length;
        comments.push(Comment(commentId, msg.sender, content, block.timestamp, referId));
        likes.push(0);
    }
    function likeComment(uint commentId) external {
        require(commentId < comments.length, "Invalid commentId");
        likes[commentId]++;
    }
}