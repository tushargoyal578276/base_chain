export const deposit_usdt="0x9F8D1028f40b2ce5Db5a86B40f34fbF08EFde777"
export const deposit_usdc="0xfD8fA46B571895232A08503818CfcA56f55A951D"
export const feed="0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419"
export const usdc="0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
export const usdt="0xdAC17F958D2ee523a2206206994597C13D831ec7"

export const deposit_busd="0xAca4bF8FB0dAfc9051d07bee4c2cCFe39fC563f0"
export const busd="0xe9e7cea3dedca5984780bafc599bd69add087d56"

export const ADDRS_CONT = {
    5: "0xf231Be68BAab095eF42Ab6BF833cFda68D175224",
    97: "0x7AECc9363018daF17Cde1E3DbfA60b72fD5586D6",
    56: "0x58A0851F5619630b0c7136fB6CD62063949986d0"
}

export const CH_ETH = 1;
export const CH_GOERLI = 5;
export const CH_BSC = 56;
export const CH_BSCTEST = 97;

export const CHAIN_INFO = {
    1: {
        chainId: '0x1',
        chainName: 'Ethereum Chain',
        nativeCurrency: {
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18,
        },
        rpcUrls: ['https://ethereum.publicnode.com/'],
        blockExplorerUrls: ['https://etherscan.io/'],
    },
    5: {
        chainId: '0x5',
        chainName: 'Goerli Test Chain',
        nativeCurrency: {
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18,
        },
        rpcUrls: ['https://ethereum-goerli.publicnode.com/'],
        blockExplorerUrls: ['https://goerli.etherscan.io/'],
    },
    56: {
        chainId: '0x38',
        chainName: 'Binace Smart Chain',
        nativeCurrency: {
            name: 'BNB',
            symbol: 'BNB',
            decimals: 18,
        },
        rpcUrls: ['https://bsc-dataseed.binance.org/'],
        blockExplorerUrls: ['https://bscscan.com/'],
    },
    97: {
        chainId: '0x61',
        chainName: 'Binace Test Chain',
        nativeCurrency: {
            name: 'BNB',
            symbol: 'BNB',
            decimals: 18,
        },
        rpcUrls: ['https://bsc-testnet.public.blastapi.io'],
        blockExplorerUrls: ['https://testnet.bscscan.com/'],
    },
}