pragma solidity ^0.4.13;

/*
    Copyright 2017, iiiPlaceHolder-overriding for injoin(injoin Research & Development)
*/

/*
    Copyright 2017, Jordi Baylina

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/// @title iiiPlaceholder Contract
/// @author Jordi Baylina
/// @dev The iiiPlaceholder contract will take control over the iii after the contribution
///  is finalized and before the Status Network is deployed.
///  The contract allows for iii transfers and transferFrom and implements the
///  logic for transferring control of the token to the network when the offering
///  asks it to do so.


import "./MiniMeToken.sol";
import "./InjoinContribution.sol";
import "./SafeMath.sol";
import "./Owned.sol";
import "./ERC20Token.sol";


contract iiiPlaceholder is TokenController, Owned {
    using SafeMath for uint256;

    MiniMeToken public iii;
    InjoinContribution public contribution;
    uint256 public activationTime;

    /// @notice Constructor
    /// @param _owner Trusted owner for this contract.
    /// @param _iii iii token contract address
    /// @param _contribution InjoinContribution contract address
   
    function iiiPlaceholder(address _owner, address _iii, address _contribution) {
        owner = _owner;
        iii = MiniMeToken(_iii);
        contribution = InjoinContribution(_contribution);
    }

    /// @notice The owner of this contract can change the controller of the iii token
    ///  Please, be sure that the owner is a trusted agent or 0x0 address.
    /// @param _newController The address of the new controller

    function changeController(address _newController) public onlyOwner {
        iii.changeController(_newController);
        ControllerChanged(_newController);
    }


    //////////
    // MiniMe Controller Interface functions
    //////////

    // In between the offering and the network. Default settings for allowing token transfers.
    function proxyPayment(address) public payable returns (bool) {
        return false;
    }



    //////////
    // Testing specific methods
    //////////

    /// @notice This function is overrided by the test Mocks.
    function getTime() internal returns (uint256) {
        return now;
    }


    //////////
    // Safety Methods
    //////////

    /// @notice This method can be used by the controller to extract mistakenly
    ///  sent tokens to this contract.
    /// @param _token The address of the token contract that you want to recover
    ///  set to 0 in case you want to extract ether.
    function claimTokens(address _token) public onlyOwner {
        if (iii.controller() == address(this)) {
            iii.claimTokens(_token);
        }
        if (_token == 0x0) {
            owner.transfer(this.balance);
            return;
        }

        ERC20Token token = ERC20Token(_token);
        uint256 balance = token.balanceOf(this);
        token.transfer(owner, balance);
        ClaimedTokens(_token, owner, balance);
    }

    event ClaimedTokens(address indexed _token, address indexed _controller, uint256 _amount);
    event ControllerChanged(address indexed _newController);
}
