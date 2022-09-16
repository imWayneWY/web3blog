// SPDX-License-Identifier: BSD 3-Clause
// Author: Wei Yan.
// A simple contract to record blogs talking about web3 for myself :)

pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Web3Blog is ERC721, ERC721URIStorage, Ownable {
    address payable private blogOwner;
    using Counters for Counters.Counter;
    Counters.Counter private blogIdCounter;
    mapping(uint256 => bytes) private blogTitles;
    event BlogCreated(address recipient, uint256 tokenId, string tokenURI);

    constructor() ERC721("W3B", "WEB3BLOG") {
        blogOwner = payable(msg.sender);
    }

    function createBlog(string memory tokenURI, bytes memory title)
        public
        onlyOwner
        returns (uint256)
    {
        blogIdCounter.increment();
        uint256 newItemId = blogIdCounter.current();
        super._safeMint(msg.sender, newItemId);
        super._setTokenURI(newItemId, tokenURI);
        blogTitles[newItemId] = title;
        emit BlogCreated(msg.sender, newItemId, tokenURI);
        return newItemId;
    }

    function fetchTitles(uint32 pageNum, bool descend)
        public
        view
        returns (bytes [10] memory)
    {
        uint8 pageSize = 10;
        uint256 id = descend
            ? blogIdCounter.current() - ((pageNum - 1) * pageSize)
            : 1 + ((pageNum - 1) * pageSize);
        bytes[10] memory titles;

        for (uint8 cnt = 0; cnt < pageSize; cnt++) {
            if (blogTitles[id].length == 0) {
                break;
            }
            titles[cnt] = blogTitles[id];
            if (descend) {
                id--;
            } else {
                id++;
            }
        }
        
        return titles;
    }

    function getCount()
        public
        view
        returns (uint256)
    {
        return blogIdCounter.current();
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}
