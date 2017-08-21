const MiniMeTokenFactory = artifacts.require("./MiniMeTokenFactory");
const Iii = artifacts.require("./iii.sol");
const InjoinContributions = artifacts.require("./InjoinContribution.sol");
const ContributionWallet = artifacts.require("./ContributionWallet.sol");
const DevTokensHolder = artifacts.require("./DevTokensHolder.sol");
const IiiPlaceHolder = artifacts.require("./iiiPlaceHolder.sol");


// All of these constants need to be configured before deploy
const addressOwner = [
"0x000000000000000000000000000000",
];
const addressesInjoin = [
    "0x000000000000000000000000000000",
];
const addressesCommunity = [
    "0x000000000000000000000000000000",
];
const addressesReserve = [
    "0x000000000000000000000000000000",
];
const addressesDevs = [
    "0x000000000000000000000000000000",
];

const startBlock = 0000000;
const endBlock = 0000000;


module.exports = async function(deployer, network, accounts) {

    // MiniMeTokenFactory send
    let miniMeTokenFactoryFuture = MiniMeTokenFactory.new();

    // MultiSigWallet wait
    let multisigInjoin = addressesInjoin;
    console.log("MultiSigWallet Injoin: " + multisigInjoin);
    let multisigCommunity = addressesCommunity;
    console.log("MultiSigWallet Community: " + multisigCommunity);
    let multisigReserve = addressesReserve;
    console.log("MultiSigWallet Reserve: " + multisigReserve);
    let multisigDevs = addressesDevs;
    console.log("MultiSigWallet Devs: " + multisigDevs);

    // MiniMeTokenFactory wait
    let miniMeTokenFactory = await miniMeTokenFactoryFuture;
    console.log("MiniMeTokenFactory: " + miniMeTokenFactory.address);
    
    // iii send
    let iiiFuture = Iii.new(miniMeTokenFactory.address);
    // InjoinContribution send
    let injoinContributionFuture = InjoinContributions.new();

    // iii wait
    let iii = await iiiFuture;
    console.log("iii: " + iii.address);
    // InjoinContribution wait
    let injoinContribution = await injoinContributionFuture;
    console.log("InjoinContribution: " + injoinContribution.address);
    console.log();

    // iii initialize checkpoints for 0th TX gas savings
    await iii.generateTokens('0x0', 1);
    await iii.destroyTokens('0x0', 1);

    // iii changeController send
    let iiiChangeControllerFuture = iii.changeController(injoinContribution.address);
    // ContributionWallet send
    let contributionWalletFuture = ContributionWallet.new(
        // multisigInjoin.address,
        multisigInjoin,
        endBlock,
        injoinContribution.address);
    // DevTokensHolder send
    let devTokensHolderFuture = DevTokensHolder.new(
        // multisigDevs.address,
        multisigDevs,
        injoinContribution.address,
        iii.address);
   
    // iii changeController wait
    await iiiChangeControllerFuture;
    console.log("iii changed controller!!!");
    // ContributionWallet wait
    let contributionWallet = await contributionWalletFuture;
    console.log("ContributionWallet: " + contributionWallet.address);
    // DevTokensHolder wait
    let devTokensHolder = await devTokensHolderFuture;
    console.log("DevTokensHolder: " + devTokensHolder.address);
   
    
    // iiiPlaceHolder send
    let IiiPlaceHolderFuture = IiiPlaceHolder.new(
        multisigCommunity,
        iii.address,
        injoinContribution.address);


    // iiiPlaceHolder wait
    let iiiPlaceHolder = await IiiPlaceHolderFuture;
    console.log("iiiPlaceHolder: " + iiiPlaceHolder.address);
    console.log();


    // injoinContribution initialize send/wait
    await injoinContribution.initialize(
        iii.address,
        iiiPlaceHolder.address,

        startBlock,
        endBlock,

        contributionWallet.address,

        multisigReserve,
        // multisigReserve.address,
        devTokensHolder.address);
    console.log("injoinContribution initialized!");
};
