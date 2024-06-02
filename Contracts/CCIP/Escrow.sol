// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {IRouterClient} from "@chainlink/contracts-ccip@1.4.0/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {OwnerIsCreator} from "@chainlink/contracts-ccip@1.4.0/src/v0.8/shared/access/OwnerIsCreator.sol";
import {Client} from "@chainlink/contracts-ccip@1.4.0/src/v0.8/ccip/libraries/Client.sol";
import {IERC20} from "@chainlink/contracts-ccip@1.4.0/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@chainlink/contracts-ccip@1.4.0/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

/// @title - A simple contract for transferring tokens across chains.
contract TokenTransferor is OwnerIsCreator {
    using SafeERC20 for IERC20;

    // Custom errors to provide more descriptive revert messages.
    error NotEnoughBalance(uint256 currentBalance, uint256 calculatedFees); // Used to make sure contract has enough balance to cover the fees.
    error NothingToWithdraw(); // Used when trying to withdraw Ether but there's nothing to withdraw.
    error FailedToWithdrawEth(address owner, address target, uint256 value); // Used when the withdrawal of Ether fails.
    error DestinationChainNotAllowlisted(uint64 destinationChainSelector); // Used when the destination chain has not been allowlisted by the contract owner.
    error InvalidReceiverAddress(); // Used when the receiver address is 0.
    // Event emitted when the tokens are transferred to an account on another chain.
    event TokensTransferred(
        bytes32 indexed messageId, // The unique ID of the message.
        uint64 indexed destinationChainSelector, // The chain selector of the destination chain.
        address receiver, // The address of the receiver on the destination chain.
        address token, // The token address that was transferred.
        uint256 tokenAmount, // The token amount that was transferred.
        address feeToken, // the token address used to pay CCIP fees.
        uint256 fees // The fees paid for sending the message.
    );

    // Event emitted when an escrow transaction is completed.
    event EscrowCompleted(
        bytes32 indexed escrowId,
        address indexed sender,
        address indexed receiver,
        address tokenSentBySender,
        uint256 amountSentBySender,
        address tokenSentByReceiver,
        uint256 amountSentByReceiver
    );

    struct Escrow {
        address sender;
        address receiver;
        address tokenSentBySender;
        uint256 amountSentBySender;
        address tokenSentByReceiver;
        uint256 amountSentByReceiver;
        bool senderDeposited;
        bool receiverDeposited;
    }

    mapping(bytes32 => Escrow) public escrows;
    mapping(uint64 => bool) public allowlistedChains;

    IRouterClient private s_router;
    IERC20 private s_linkToken;

    /// @notice Constructor initializes the contract with the router address.
    /// @param _router The address of the router contract.
    /// @param _link The address of the link contract.
    constructor(address _router, address _link) {
        s_router = IRouterClient(_router);
        s_linkToken = IERC20(_link);
    }

    /// @dev Modifier that checks if the chain with the given destinationChainSelector is allowlisted.
    /// @param _destinationChainSelector The selector of the destination chain.
    modifier onlyAllowlistedChain(uint64 _destinationChainSelector) {
        if (!allowlistedChains[_destinationChainSelector])
            revert DestinationChainNotAllowlisted(_destinationChainSelector);
        _;
    }

    /// @dev Modifier that checks the receiver address is not 0.
    /// @param _receiver The receiver address.
    modifier validateReceiver(address _receiver) {
        if (_receiver == address(0)) revert InvalidReceiverAddress();
        _;
    }

    /// @dev Updates the allowlist status of a destination chain for transactions.
    /// @notice This function can only be called by the owner.
    /// @param _destinationChainSelector The selector of the destination chain to be updated.
    /// @param allowed The allowlist status to be set for the destination chain.
    function allowlistDestinationChain(
        uint64 _destinationChainSelector,
        bool allowed
    ) external onlyOwner {
        allowlistedChains[_destinationChainSelector] = allowed;
    }

    /// @notice Initiate an escrow transaction.
    /// @param _escrowId The ID of the escrow transaction.
    /// @param _receiver The address of the receiver.
    /// @param _tokenSentBySender The token address to be sent by the sender.
    /// @param _amountSentBySender The amount of tokens to be sent by the sender.
    /// @param _tokenSentByReceiver The token address to be sent by the receiver.
    /// @param _amountSentByReceiver The amount of tokens to be sent by the receiver.
    function initiateEscrow(
        bytes32 _escrowId,
        address _receiver,
        address _tokenSentBySender,
        uint256 _amountSentBySender,
        address _tokenSentByReceiver,
        uint256 _amountSentByReceiver
    ) external onlyOwner validateReceiver(_receiver) {
        require(
            escrows[_escrowId].sender == address(0),
            "Escrow already exists"
        );

        Escrow storage escrow = escrows[_escrowId];
        escrow.sender = msg.sender;
        escrow.receiver = _receiver;
        escrow.tokenSentBySender = _tokenSentBySender;
        escrow.amountSentBySender = _amountSentBySender;
        escrow.tokenSentByReceiver = _tokenSentByReceiver;
        escrow.amountSentByReceiver = _amountSentByReceiver;
    }

    /// @notice Deposit tokens into escrow.
    /// @param _escrowId The ID of the escrow transaction.
    /// @dev Both sender and receiver must approve the contract to transfer their tokens beforehand.
    function depositTokensToEscrow(bytes32 _escrowId) external {
        Escrow storage escrow = escrows[_escrowId];
        require(
            msg.sender == escrow.sender || msg.sender == escrow.receiver,
            "Not a participant"
        );

        if (msg.sender == escrow.sender) {
            IERC20(escrow.tokenSentBySender).safeTransferFrom(
                msg.sender,
                address(this),
                escrow.amountSentBySender
            );
            escrow.senderDeposited = true;
        } else if (msg.sender == escrow.receiver) {
            IERC20(escrow.tokenSentByReceiver).safeTransferFrom(
                msg.sender,
                address(this),
                escrow.amountSentByReceiver
            );
            escrow.receiverDeposited = true;
        }

        if (escrow.senderDeposited && escrow.receiverDeposited) {
            _finalizeEscrow(_escrowId);
        }
    }

    function _finalizeEscrow(bytes32 _escrowId) private {
        Escrow storage escrow = escrows[_escrowId];

        IERC20(escrow.tokenSentBySender).safeTransfer(
            escrow.receiver,
            escrow.amountSentBySender
        );
        IERC20(escrow.tokenSentByReceiver).safeTransfer(
            escrow.sender,
            escrow.amountSentByReceiver
        );

        emit EscrowCompleted(
            _escrowId,
            escrow.sender,
            escrow.receiver,
            escrow.tokenSentBySender,
            escrow.amountSentBySender,
            escrow.tokenSentByReceiver,
            escrow.amountSentByReceiver
        );

        delete escrows[_escrowId];
    }

    // Existing functions for token transfer with LINK payment...

    // Existing functions for token transfer with native payment...

    // Existing fallback and withdrawal functions...

    receive() external payable {}
    function withdraw(address _beneficiary) public onlyOwner {
        uint256 amount = address(this).balance;
        if (amount == 0) revert NothingToWithdraw();
        (bool sent, ) = _beneficiary.call{value: amount}("");
        if (!sent) revert FailedToWithdrawEth(msg.sender, _beneficiary, amount);
    }
    function withdrawToken(
        address _beneficiary,
        address _token
    ) public onlyOwner {
        uint256 amount = IERC20(_token).balanceOf(address(this));
        if (amount == 0) revert NothingToWithdraw();
        IERC20(_token).safeTransfer(_beneficiary, amount);
    }
}
