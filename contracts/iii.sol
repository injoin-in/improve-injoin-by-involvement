pragma solidity ^0.4.13;

/*
    Copyright 2017, injoin (Injoin Research & Development)
*/


import "./MiniMeToken.sol";


contract iii is MiniMeToken {
    // @dev iii constructor just parametrizes the MiniMeIrrevocableVestedToken constructor
    function iii(address _tokenFactory)
            MiniMeToken(
                _tokenFactory,
                0x0,                     // no parent token
                0,                       // no snapshot block number from parent
                "Improve Injoin by Involvement",  // Token name
                18,                      // Decimals
                "iii",                   // Symbol
                false                     // Enable transfers
            ) {}
}
