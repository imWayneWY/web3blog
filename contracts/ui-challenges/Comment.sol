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
        uint referId;
        address referAuthor;
        string referContent;
        uint referPostTime;
        address[] likes;
    }

    event AddComment(address author, uint id);
	Comment[] private comments;
    mapping(uint => address[]) private likes;

    constructor() {
        // This is meaningless comment, just for comment without refer to point
        comments.push(Comment(0, msg.sender, "", block.timestamp, 0));
    }

    function postComment(string memory content, uint referId) external {
        require(referId < comments.length, "Invalid referId");
        uint commentId = comments.length;
        comments.push(Comment(commentId, msg.sender, content, block.timestamp, referId));
        emit AddComment(msg.sender, commentId);
    }
    function likeComment(uint commentId) external {
        require(commentId < comments.length, "Invalid commentId");
        address[] memory existedLikesUser = likes[commentId];
        for (uint i=0; i<existedLikesUser.length; i++) {
            require(existedLikesUser[i] != msg.sender, "You already liked");
        }
        likes[commentId].push(msg.sender);
    }
    function listComments() external view returns (OutputComment[] memory) {
        OutputComment[] memory commentList = new OutputComment[](comments.length-1);
        uint idx = 0;
        for (uint i=comments.length-1; i > 0; i--) {
            commentList[idx] = OutputComment(
                comments[i].id,
                comments[i].author,
                comments[i].content,
                comments[i].postTime,
                comments[i].referId,
                comments[comments[i].referId].author,
                comments[comments[i].referId].content,
                comments[comments[i].referId].postTime,
                likes[i]
            );
            idx++;
        }
        return commentList;
    }
}