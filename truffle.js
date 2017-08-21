module.exports = {
    networks: {
        development: {
            network_id: 15,
            host: "localhost",
            port: 8545,
            gas: 4000000,
            gasPrice: 20e9,
        },
        mainnet: {
            network_id: 1,
            host: "localhost",
            port: 8545,
            gas: 4000000,
            gasPrice: 20e9,
            from: "0x000000000000000000000000000000",
        },
        ropsten: {
            network_id: 3,
            host: "localhost",
            port: 8545,
            gas: 4000000,
            gasPrice: 20e9,
            from: "0x000000000000000000000000000000",
        },
       
    }
};
