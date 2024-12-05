// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IERC20.sol";
/* Step 1: Import this (hardhat version) */
import "@identity.com/gateway-protocol-eth/contracts/Gated.sol";

/* Step 2: Add the Gated trait */
contract Airdrop is IERC20, Gated {
    uint public totalSupply;
    mapping(address => uint) public balanceOf;
    mapping(address => mapping(address => uint)) public allowance;
    string public name = "My simple ERC20";
    string public symbol = "ERC20";
    uint8 public decimals = 18;

    address public constant GATEWAY_TOKEN_CONTRACT = 0xF65b6396dF6B7e2D8a6270E3AB6c7BB08BAEF22E;

    /* Step 3: Add a constructor */
    constructor(uint256 gatekeeperNetwork) Gated(GATEWAY_TOKEN_CONTRACT, gatekeeperNetwork){
    }

    /* Step 4: Gate your function */
    function claim() external gated /* This is where the magic happens */ {
        require(balanceOf[msg.sender] == 0, "You already claimed your tokens");
        balanceOf[msg.sender] += 1;
        totalSupply += 1;
        emit Transfer(address(0), msg.sender, 1);
    }

    function transfer(address recipient, uint amount) external returns (bool) {
        balanceOf[msg.sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    function approve(address spender, uint amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint amount
    ) external returns (bool) {
        allowance[sender][msg.sender] -= amount;
        balanceOf[sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(sender, recipient, amount);
        return true;
    }

    function burn(uint amount) external {
        balanceOf[msg.sender] -= amount;
        totalSupply -= amount;
        emit Transfer(msg.sender, address(0), amount);
    }
}
