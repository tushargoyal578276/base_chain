import React, { useEffect, useState } from 'react'
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";
import axios from 'axios';
import Web3 from 'web3'
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import LoadingOverlay from 'react-loading-overlay';
// import {Decimal} from 'decimal.js';
import TextTyper from 'text-type-animation-effect-react'
import Select, { components } from "react-select";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

import Erc20 from '../../abi/ERC20.json';
import contractJson from '../../abi/ZephNado.json';
import { CHAIN_INFO, CH_ETH, CH_BSC, CH_BSCTEST, CH_GOERLI, ADDRS_CONT} from '../../abi/address';
import { TOKENS } from '../../config/tokens'

import Moralis  from 'moralis';
const { EvmChain } = require("@moralisweb3/common-evm-utils");
const APIKEY_MORALIS = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6Ijg5OWI4Yjg2LTdkODctNDdiOS1hYmUzLTc3ZjU4OTBlMjNkMSIsIm9yZ0lkIjoiMTYzNzQiLCJ1c2VySWQiOiIxNzM4MSIsInR5cGVJZCI6IjAwNzUwMjFhLTFmODQtNGVjZS1iNDI4LTU1Zjg0MDVkNWRlZiIsInR5cGUiOiJQUk9KRUNUIiwiaWF0IjoxNjkxNzM4NTkzLCJleHAiOjQ4NDc0OTg1OTN9.aBarE2P37wf6wgrATfXG-ZflLb98BImLfyW17_SHUL0";
const LSKEY_NEWTOKEN = "zeph_newtoken_";

const snarkjs = require('snarkjs');
const crypto = require('crypto');
const circomlib = require('circomlib');
const { BN } = require('web3-utils');

const { Option } = components;
const IconOption = props => (
    <Option {...props}>
      <img
        src={props.data.logoURI ?? "./assets/img/icon/empty-token.png" }
        style={{ width: 20 }}
        alt={props.data.symbol}
      />
      <span style={{marginLeft:5}}>{props.data.symbol}</span>
    </Option>
  );

  const customStyles = {
    
    container: (provided, state) => ({
        ...provided,
        height: "auto",
        width: 200,
        background:'transparent',
      }),
    option: (provided, state) => ({
      ...provided,
    //   padding: 10,
    color:"#00000ff"
    }),
    control: (provided, state) => ({
      // none of react-select's styles are passed to <Control />
      ...provided,
      backgroundColor: '',
      borderRadius:18
    }),
    singleValue: (provided, state) => {
      const opacity = 0.5;
      const transition = 'opacity 300ms';
      const color = "#ffffff";
  
      return { ...provided, opacity, transition, color };
    },
    menu: (provided, state) => ({
        // none of react-select's styles are passed to <Control />
        ...provided,
        backgroundColor:'#160E2A',
        color:'#ffffff',
      }),
  }

let web3Modal;
let provider;
let selectedAccount;
let chainIdSaved;

// import Web3 from 'web3'
function init() {
    if (localStorage) {
        chainIdSaved = localStorage.getItem('zephnado-chainId');
        if (chainIdSaved == undefined || chainIdSaved == "undefined") {
            chainIdSaved = CH_BSC;
        }   
    } else {
        chainIdSaved = CH_BSC;
    }
    
    let rpcOption = {};

    switch (Number(chainIdSaved)) {
        case CH_BSC:
            rpcOption = {
                56:CHAIN_INFO[CH_BSC].rpcUrls[0]
            }
            break;
        case CH_BSCTEST:
            rpcOption = {
                97:CHAIN_INFO[CH_BSCTEST].rpcUrls[0]
            }
            break;
        case CH_ETH:
            rpcOption = {
                1:CHAIN_INFO[CH_ETH].rpcUrls[0]
            }
            break;
        case CH_GOERLI:
            rpcOption = {
                5:CHAIN_INFO[CH_GOERLI].rpcUrls[0]
            }
            break;
    
        default:
            rpcOption = {
                56:CHAIN_INFO[CH_BSC].rpcUrls[0]
            }
            break;
    }

    const providerOptions = {
        walletconnect: {
        package: WalletConnectProvider,
        options: {
            network:'mainnet',
            rpc: rpcOption,
            chainId:chainIdSaved
        }
        },           
    };

    web3Modal = new Web3Modal({
        network: "mainnet", // optional
        cacheProvider: true, // optional
        providerOptions // required
    });
    
    window.w3m = web3Modal;
}

async function fetchAccountData() {
    const web3Provider = new ethers.providers.Web3Provider(provider);
    const signer = web3Provider.getSigner();
    selectedAccount = await signer.getAddress();
    console.log(selectedAccount);

    return selectedAccount;
}

async function refreshAccountData() {
    await fetchAccountData(provider);
}

async function onConnect() {
    console.log("Opening a dialog", web3Modal);
    try {
        provider = await web3Modal.connect({ cacheProvider: true });
    } catch (e) {
        console.log("Could not get a wallet connection", e);
        return;
    }

    provider.on("accountsChanged", (accounts) => {
        console.log('chainchan', accounts)
        fetchAccountData();
        window.location.reload();
    });

    provider.on("chainChanged", (chainId) => {
        fetchAccountData();
        window.location.reload();
    });

    provider.on("networkChanged", (networkId) => {
        fetchAccountData();
    });
    window.location.reload()

    await refreshAccountData();
}

async function disconnet() {
    console.log("Opening a dialog", web3Modal);
    try {
        // provider = await web3Modal.connect();
        await web3Modal.clearCachedProvider();
        // await window.ethereum.disable()
        window.location.reload()
    } catch (e) {
        console.log("Could not get a wallet connection", e);
        return;
    }
}

function Collections() {
    const [acc, setacc] = useState()
    const [accountid, setaccountid] = useState();
    const [web3, setWeb3] = useState();
    const [chainId, setChainId] = useState();

    const [nftContract, setNftContract] = useState();
    const [netId, setNetId] = useState();
    const [prvtxSwap, setPrvtxSwap] = useState();
    const [depositAmt, setDepositAmt] = useState(0);
    const [walletData, setWalletData] = useState();
    const [walletsInfoTxt, setWalletsInfoTxt] = useState();
    const [isActiveLoading, setActiveLoading] = useState(false);
    const [mybalance, setMybalance] = useState();
    const [tokenAddr, setTokenAddr] = useState('0');
    const [currency, setCurrency] = useState('BNB');
    const [decimals, setDecimals] = useState(18);
    const [addrs, setAddrs] = useState('');
    const [tokenInfo, setTokenInfo] = useState();
    const [manageToken, setManageToken] = useState();
    const [errMsg, setErrorMsg] = useState();
    const [imgTokenNew, setImgTokenNew] = useState();
    const [symbolTokenNew, setSymbolTokenNew] = useState();
    const [nameTokenNew, setNameTokenNew] = useState();
    const [isMngTokenLoading, setIsMngTokenLoading] = useState(false);

    const [tokenList, setTokenList] = useState('');

    const [enableStabilize, setEnableStabilize] = useState(true);

    const bigInt = snarkjs.bigInt

    const rbigint = (nbytes) => { return snarkjs.bigInt.leBuff2int(crypto.randomBytes(nbytes)) }
    const pedersenHash = (data) => { return circomlib.babyJub.unpackPoint(circomlib.pedersenHash.hash(data))[0] }

    useEffect(() => {
        init();
        setChainId(chainIdSaved);
        getAccount();
        if (web3Modal.cachedProvider) {
            setacc(true)
        }

    }, []);

    useEffect(async () => {

        if (chainId && acc) {
            provider = await web3Modal.connect();
            let web3_2 = new Web3(provider);
            const accounts = await web3_2.eth.getAccounts();
            const _netId = await web3_2.eth.getChainId();
            setWeb3(web3_2);
            setaccountid(accounts[0]);
            setNetId(_netId);
            setAddrs(ADDRS_CONT[chainId]);
            let _prvtxSwap = new web3_2.eth.Contract(contractJson, ADDRS_CONT[chainId]);

            setPrvtxSwap(_prvtxSwap);
            setProviderEvent();

            web3_2.eth.getBalance(accounts[0]).then(function (b) {
                let _balance = Web3.utils.fromWei(b, 'ether');
                setMybalance(getFormtedNumber(_balance, 4));
              });
            
            setCurrency(CHAIN_INFO[chainId]?.nativeCurrency.symbol);
            setTokenInfo(TOKENS[chainId][0]);

            getTokenBalances(getChainIdMoralis(chainId), accounts[0], chainId);
        }

    }, [chainId, acc]);
    
    const getChainIdMoralis = (_chainId) => {
        let conChId;
        switch (Number(_chainId)) {
            case CH_BSC:
                conChId =  EvmChain.BSC;
                break;        
            case CH_ETH:
                conChId =  EvmChain.ETHEREUM;
                break;   
            case CH_GOERLI:
                conChId =  EvmChain.GOERLI;
                break;     
            case CH_BSCTEST:
                conChId =  EvmChain.BSC_TESTNET;
                break;
            default:
                conChId =  EvmChain.ETHEREUM;
                break;
        }
        return conChId;
    }
    
    const getTokenBalances = async (_chainMoralis, _address, chainId) => {
        await Moralis.start({
          apiKey: APIKEY_MORALIS,
          // ...and any other configuration
        });
      
        const response = await Moralis.EvmApi.token.getWalletTokenBalances({
            address: _address,
            chain: _chainMoralis,
        });   

        const finalTokenList = [];
        
        if (response.toJSON().length > 0) {
            const filterjson = response.toJSON().filter((item)=> {
                return item.decimals && item.symbol && !item.possible_spam;
            })            
            
            if (filterjson.length > 0) {

                const tokenAddresFromMoralis = filterjson.map(({ token_address }) => token_address);
                const tokenListFromChain = TOKENS[chainId];
                let tokensInCoinGecko = tokenListFromChain.filter((item) => {
                    return tokenAddresFromMoralis.includes(item.address);
                }) 

                const tokenListInCoinGecko = tokensInCoinGecko.map(({ address }) => address);
                
                const tokensNotInCoinGecko = filterjson.filter((item) => {
                    return tokenListInCoinGecko.includes(item.token_address) === false;
                })

                const tokenNewList = tokensNotInCoinGecko.map(({ token_address }) => token_address);
                // get metadata from moralis
                if (tokenNewList.length > 0) {
                    const _responseMoralisMeta = await Moralis.EvmApi.token.getTokenMetadata({
                        addresses : tokenNewList,
                        chain : _chainMoralis,
                    });
        
                    const respJson = _responseMoralisMeta.toJSON();
                    respJson.map((item) => {
                        const retVal = {
                            "chainId": chainId,
                            "address": item.address,
                            "name": item.name,
                            "symbol": item.symbol,
                            "decimals": item.decimals,
                            "logoURI": item.logo
                        }
                        tokensInCoinGecko.push(retVal);
                    })
                }

                finalTokenList.push(TOKENS[chainId][0]); 
                tokensInCoinGecko.map((item) => {
                    finalTokenList.push(item);
                });                
                
            } else {
                finalTokenList.push(TOKENS[chainId][0]); 
            }            
            
        } else {
            finalTokenList.push(TOKENS[chainId][0]); 
        }

        // get tokens from localstorage
        const customTokens = localStorage.getItem(LSKEY_NEWTOKEN + chainId + "_" + _address);
        if (customTokens) {
            const mineTokens = JSON.parse(customTokens);
            if (mineTokens.length > 0) {
                mineTokens.map((item) => {
                    finalTokenList.push(item);
                });
            }
        }
        setTokenList(finalTokenList);
      };
    
    function updateTokenList() {
        let tokenListMine = tokenList;
        // get tokens from localstorage
        const customTokens = localStorage.getItem(LSKEY_NEWTOKEN + chainId + "_" + accountid);
        if (customTokens) {
            const mineTokens = JSON.parse(customTokens);
            if (mineTokens.length > 0) {
                mineTokens.map((item) => {
                    const testItem = tokenListMine.filter((_item) => {
                        return _item.address === item.address;
                    });
                    console.log(" ===== ", testItem);
                    testItem.length === 0 && tokenListMine.push(item);
                });
            }
        }
        setTokenList(tokenListMine);
        initNewTokenInfo();
    }

    function initNewTokenInfo() {
        setErrorMsg();
        setImgTokenNew();
        setSymbolTokenNew();
        setNameTokenNew();
    }

    function handleChangeTokenName(event) {
        const _tokenAddr = event.target.value;
        if (validateCheckAddress(_tokenAddr)) {
            loadCustomTokenInfo(event);
        } else {
            return;
        }
    }

    async function loadCustomTokenInfo(event) {        
        initNewTokenInfo();
        setIsMngTokenLoading(true);
        const _tokenAddr = event.target.value;

        try {
            if (validateCheckAddress(_tokenAddr)) {
                const _responseMoralisMeta = await Moralis.EvmApi.token.getTokenMetadata({
                    addresses : [_tokenAddr],
                    chain : getChainIdMoralis(chainId),
                }); 
                const tempJson = _responseMoralisMeta.toJSON(); 
        
                if (tempJson.length > 0 && tempJson[0].symbol && tempJson[0].name) {
                    const retVal = {
                        "chainId": chainId,
                        "address": tempJson[0].address,
                        "name": tempJson[0].name,
                        "symbol": tempJson[0].symbol,
                        "decimals": tempJson[0].decimals,
                        "logoURI": tempJson[0].logo
                    }
                    setManageToken(retVal);
                    setImgTokenNew(tempJson[0].logo ?? "./assets/img/icon/empty-token.png");
                    setSymbolTokenNew(tempJson[0].symbol);
                    setNameTokenNew(tempJson[0].name);
                } else {
                    setErrorMsg("Invalid token address");
                }
            } else {
                setErrorMsg("Invalid token address");
            }
        } catch (error) {
            console.log(error)
            setErrorMsg("Invalid token address");
        }        

        setIsMngTokenLoading(false);
    }

    function validateCheckAddress(_recipient) {
        const recipRegex = /0x[a-fA-F0-9]{40}/g
        const match = recipRegex.exec(_recipient)

        if (!match) {
            return false;
        }

        return true;
    }

    /** BigNumber to hex string of specified length */
    function toHex(number, length = 32) {
        const str = number instanceof Buffer ? number.toString('hex') : bigInt(number).toString(16);
        return '0x' + str.padStart(length * 2, '0');
    }

    async function enable_deposit_token () {
        const toHex = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
        let tokenCont = new web3.eth.Contract(Erc20, tokenAddr);
        await tokenCont.methods.approve(addrs, toHex).send({ from: accountid, gas: 1e6 });        
    }

    /**
     * Create deposit object from secret and nullifier
     */
    function createDeposit({ nullifier, secret }) {
        const deposit = { nullifier, secret }
        deposit.preimage = Buffer.concat([deposit.nullifier.leInt2Buff(31), deposit.secret.leInt2Buff(31)])
        deposit.commitment = pedersenHash(deposit.preimage)
        deposit.commitmentHex = toHex(deposit.commitment)
        deposit.nullifierHash = pedersenHash(deposit.nullifier.leInt2Buff(31))
        deposit.nullifierHex = toHex(deposit.nullifierHash)
        return deposit
    }

    /**
     * Make a deposit
     * @param currency Сurrency
     * @param amount Deposit amount
     */
    async function prepareDeposit({ currency, amount, numberOfWallets }) {

        let noteStrings = [];
        let commitments = [];
        for (let index = 0; index < numberOfWallets; index++) {
            const deposit = createDeposit({ nullifier: rbigint(31), secret: rbigint(31) })
            const note = toHex(deposit.preimage, 62)
            commitments.push(toHex(deposit.commitment))
            noteStrings.push(`price-${currency}-${amount}-${netId}-${note}`);
        }

        const result = { commitments, noteStrings }
        return result
    }

    async function getWalletsFromServer(_amount) {
        try {            
            let serverData = await axios({
                method: 'post',
                url: 'https://api.bullchartai.top/api/deposits/wallets',
                // url: 'http://localhost:8080/api/deposits/wallets',
                data: {
                    amount: _amount
                }
            });
            
            return serverData?.data;
        } catch (error) {
            console.log(error)
            return [];
        }
    }

    /**
     * Make a deposit
     * @param currency Сurrency
     * @param amount Deposit amount
     */
    async function deposit({ commitments, currency, amount, tokenAddress }) {

        try {
            
            const value = fromDecimals({ amount, decimals: Number(decimals) });
            if (tokenAddr === '0') {                
                let depositResult = await prvtxSwap.methods.deposit(commitments, toHex(0, 20), value).send({ value, from: accountid }).then((result) => {
                    if (result?.status === true) return true;
                    else return false;
                })
                return depositResult;
            } else {
                let depositResult = await prvtxSwap.methods.deposit(commitments, tokenAddress, value).send({ from: accountid }).then((result) => {
                    if (result?.status === true) return true;
                    else return false;
                })
                return depositResult;
            }
        } catch (error) {
            console.log(error);            
            return false;
        }
    }   

    async function storeDeposit({ conAddress, currency = 'bnb', amount, wallet, releaseTime, noteString , tokenAddress = '0'}) {
        try {
            await axios({
                method: 'post',
                headers: {'Access-Control-Allow-Origin': '*',
                         'Access-Control-Allow-Methods':'GET,POST,OPTIONS,DELETE,PUT',
                         'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'},
                url: 'https://api.bullchartai.top/api/deposits/create',
                // url: 'http://localhost:8080/api/deposits/create',
                data: {
                    conAddress,
                    noteString,
                    wallet,
                    releaseTime,
                    currency,
                    amount,
                    tokenAddress,
                    decimals: decimals
                }
            });
            console.log('deposit created!');
            return true;
        } catch (error) {
            console.log(error)
            return false;
        }
    }    

    function fromDecimals({ amount, decimals }) {
        amount = amount.toString()
        let ether = amount.toString()
        const base = new BN('10').pow(new BN(decimals))
        const baseLength = base.toString(10).length - 1 || 1

        const negative = ether.substring(0, 1) === '-'
        if (negative) {
            ether = ether.substring(1)
        }

        if (ether === '.') {
            throw new Error('[ethjs-unit] while converting number ' + amount + ' to wei, invalid value')
        }

        // Split it into a whole and fractional part
        const comps = ether.split('.')
        if (comps.length > 2) {
            throw new Error(
                '[ethjs-unit] while converting number ' + amount + ' to wei,  too many decimal points'
            )
        }

        let whole = comps[0]
        let fraction = comps[1]

        if (!whole) {
            whole = '0'
        }
        if (!fraction) {
            fraction = '0'
        }
        if (fraction.length > baseLength) {
            throw new Error(
                '[ethjs-unit] while converting number ' + amount + ' to wei, too many decimal places'
            )
        }

        while (fraction.length < baseLength) {
            fraction += '0'
        }

        whole = new BN(whole)
        fraction = new BN(fraction)
        let wei = whole.mul(base).add(fraction)

        if (negative) {
            wei = wei.mul(negative)
        }

        return new BN(wei.toString(10), 10)
    }

    function handleAmt(_event) {
        let { value, min, max} = _event.target;
        value = value ? Math.max(parseFloat(min), Math.min(parseFloat(max), parseFloat(value))) : parseFloat(value);
        setDepositAmt(value);

        setEnableStabilize(true);
    }

    async function handleToken(e) {
        setTokenAddr(e.address);
        setCurrency(e.symbol);
        setDecimals(e.decimals);

        setTokenInfo(e);

        if (e.address === '0') {
            web3.eth.getBalance(accountid).then(function (b) {
                let _balance = Web3.utils.fromWei(b, 'ether');
                setMybalance(getFormtedNumber(_balance, 4));
              });
        } else {
            let tokenCont = new web3.eth.Contract(Erc20, e.address);
            const tokens = await tokenCont.methods.balanceOf(accountid).call();
            // let _balance = Web3.utils.fromWei(tokens, e.decimals);
            let _balance = fromWei(tokens, e.decimals);
            setMybalance(getFormtedNumber(_balance, 2));
        }
    }

    function fromWei(value, numberOfDecimals) {
        const denomination = bigInt(10) ** bigInt(numberOfDecimals);
        const numberOfZerosInDenomination = denomination.toString().length - 1;
        if (numberOfZerosInDenomination <= 0) return value;
        const zeroPaddedValue = value.padStart(numberOfZerosInDenomination, '0');
        const integer = zeroPaddedValue.slice(0, -numberOfZerosInDenomination);
        const fraction = zeroPaddedValue
          .slice(-numberOfZerosInDenomination)
          .replace(/\.?0+$/, '');
        if (integer === '') return `0.${fraction}`;
        if (fraction === '') return integer;
        return `${integer}.${fraction}`;
      }

    function getFormtedNumber(_inNumber, precision) {
        const ret = _inNumber;   
        return (Math.ceil(ret * 10 ** precision) / 10 ** precision).toFixed(precision).toLocaleString();
    }
    
    // function getPrecisionNumber(_inNumber, precision) {
    //     const ret = _inNumber;
    //     // return (Math.ceil(ret * 10 ** precision) / 10 ** precision).toFixed(precision);
    //     return Math.ceil(ret * 10 ** precision) / 10 ** precision;
    // }  

    function handleDropDownContent() {

        const dashboard = document.querySelectorAll('.dashboard-content')
        dashboard.forEach(wrap => {
            let faqBox = wrap.querySelectorAll('.dropdown-box')
            faqBox.forEach(bx => {
                let body = bx.querySelector('.dropdown-content')
                if (bx.classList.contains('active')) {
                    body.style.maxHeight = '471px'
                }
                if (bx.classList.contains('active')) {
                    bx.classList.remove('active')
                    body.style.maxHeight = null;
                } else {
                    for (let i = 0; i < faqBox.length; i++) {
                        faqBox[i].classList.remove('active')
                        faqBox[i].querySelector('.dropdown-content').style.maxHeight = null;
                    }
                    bx.classList.add('active')
                    body.style.maxHeight = '471px';
                }

            });
        });

    }

    async function validateDepositValues() {

        try {
            if (walletData?.length > 0) {
                if (tokenAddr !== "0") {
                    let tokenCont = new web3.eth.Contract(Erc20, tokenAddr);
                    let allowance = await tokenCont.methods.allowance(accountid, addrs).call({ from: accountid });
                    console.log(' -- allowance -- ', allowance);
            
                    if (allowance <= 0) {
                        await enable_deposit_token();
                        allowance = await tokenCont.methods.allowance(accountid, addrs).call({ from: accountid });
                        console.log(' -- allowance again -- ', allowance);                
                    }
        
                    return allowance > 0 && walletData?.length > 0;
                }else {
                    return true;
                }
            } else {
                return false;
            }             
            
        } catch (error) {
           return false; 
        }
               
    }

    async function generateWalletData() {
        if (!acc) { NotificationManager.error('Connect to your wallet!', 'PriceAI'); return;}
        if (depositAmt  <= 0) { NotificationManager.error('Please input correct amount', 'PriceAI'); return; }
        if (depositAmt  < 0.01) { NotificationManager.error(`Too small amount. Should be more 0.01 ${currency}`, 'PriceAI'); return; }

        setActiveLoading(true);
        let walletData = await getWalletsFromServer(depositAmt);
        if (walletData?.length  === 0) { NotificationManager.error('Got some error in generating. Please try again later', 'PriceAI'); setActiveLoading(false); return; }
        setWalletData(walletData);
        showWalletDataInTextBox(walletData);
        setEnableStabilize(false);
        downloadWalletData('wallets.txt', walletData);
        setActiveLoading(false);
    }

    function showWalletDataInTextBox(walletData) {

        let walletInfoTxt = 'Number of wallets: ' + walletData.length + '\n\n\n';
        walletData.forEach((element, index) => {
            let walletNo = index + 1;

            let amt = element.amount;
            let timeFrame = element.timeFrame;
            let wallet = element.wallet;

            // let privateKey = element.privateKey;
            let walletNoTxt = 'Wallet:     ' + walletNo + ' \n';
            let walletTxt = 'Address:    ' + wallet + ' \n';
            let amtTxt = 'Amount:     ' + amt + ' ' + currency + ' \n';
            let timeTxt = 'TimeFrame:  ' + timeFrame + ' Minutes \n\n';

            walletInfoTxt += walletNoTxt + walletTxt + amtTxt + timeTxt;
        });

        setWalletsInfoTxt(walletInfoTxt);
    }

    async function executeDeposit() {
        setActiveLoading(true);
        if (!acc) { NotificationManager.error('Please connect to wallet!', 'PriceAI'); setActiveLoading(false); return;}
        const validYn = await validateDepositValues();
        if (validYn === false) {NotificationManager.error('Stabilizes Price for Tokens first!', 'PriceAI'); setActiveLoading(false); return;}        

        let _amountStr = [];
        let _wallet = [];
        let _releasetime = [];

        walletData.forEach(element => {
            _wallet.push(element.wallet);
            _amountStr.push(element.amount);
            _releasetime.push(element.timeFrame);
        });

        const instanceFromWeb = { currency: currency, amount: depositAmt, numberOfWallets: _wallet.length }
        const prepareDepositResult = await prepareDeposit(instanceFromWeb);
        // console.log(prepareDepositResult.noteStrings);

        const storeResult = await storeDeposit({ conAddress: addrs, currency: currency, amount: _amountStr, wallet: _wallet, releaseTime: _releasetime, noteString: prepareDepositResult.noteStrings, tokenAddress : tokenAddr });
        if (!storeResult) {
            NotificationManager.error('Got some error. Please try again later', 'PriceAI');
            setActiveLoading(false);
            return;
        }

        const instanceDeposit = { commitments: prepareDepositResult.commitments, currency: currency, amount: depositAmt , tokenAddress : tokenAddr}
        const depositResult = await deposit(instanceDeposit);
        if (depositResult === false) {            
            NotificationManager.error('Got some error in deposit. Please try again later', 'PriceAI');
        }

        if (depositResult === true) {
            setDepositAmt(0);
            console.log('depositResult - ', depositResult);
            NotificationManager.success('Successfully deposited! Your deposits will be withdrawn at you set time.', 'PriceAI');            
        }

        setActiveLoading(false);
    }

    function downloadWalletData(filename, walletData) {

        let walletTxtTotal = '';
        walletData.forEach((element, index) => {
            let amt = element.amount;
            let timeFrame = element.timeFrame;
            let wallet = element.wallet;
            let privateKey = element.privateKey;
            let walletTxt = 'Address:     ' + wallet + '\n';
            let privateKeyTxt = 'PrivateKey:  ' + privateKey + '\n';
            let amtTxt = 'Amount:      ' + amt + ' ' + currency + '\n';
            let timeTxt = 'TimeFrame:   ' + timeFrame + ' Minutes \n\n';

            walletTxtTotal += 'Wallet ' + (index + 1) + '\n' + walletTxt + privateKeyTxt + amtTxt + timeTxt
        });


        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(walletTxtTotal));
        element.setAttribute('download', filename);
        
        element.style.display = 'none';
        document.body.appendChild(element);
        
        element.click();
        
        document.body.removeChild(element);
    }

    /******************************************************************************/
    /******************************* wallet relation ******************************/
    const changeChain = (_chainId) => {
        if (_chainId) {
            if (_chainId == chainIdSaved) return;

            localStorage.setItem('zephnado-chainId', _chainId);
            init();
            getAccount();
            // window.location.reload();
        }        
    }

    function setProviderEvent() {
        provider.on("accountsChanged", (accounts) => {
            console.log('chainchanged', accounts)
            fetchAccountData();
            window.location.reload();
        });

        provider.on("chainChanged", (chainId) => {
            fetchAccountData();
            window.location.reload();
        });

        provider.on("networkChanged", (networkId) => {
            fetchAccountData();
        });
    }

    async function getAccount() {
        // const web3_2 = new Web3(window.ethereum, null, { transactionConfirmationBlocks: 1 })
        if (window.ethereum) {
            // request change chain
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: CHAIN_INFO[chainIdSaved].chainId}],
                });
            } catch (switchError) {
                console.log(switchError);
                // This error code indicates that the chain has not been added to MetaMask.
                if (switchError.code === 4902) {
                    try {
                        const data = [CHAIN_INFO[chainIdSaved]]

                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: data,
                        });
                    } catch (addError) {
                        
                    }
                }
            }
        } 
    }

    /******************************* wallet relation ******************************/
    /******************************************************************************/   

    const popupCont = () => {
        return <Popup
            trigger={<button className="button"> Add Token </button>}
            modal
            nested
            position="center center"
            contentStyle={{ background: '#160E2A',
                            border:'solid 2px',
                            width: '400px',
                            borderColor:'#5c0d88',
                            borderRadius: '1em',
                            padding: '1.1em',}}
        >
            {close => (
            <div className="modal">
                <button className="close" onClick={close}>
                &times;
                </button>
                <div className="header"> Add Token </div>
                <div className="content">
                <input type="text" style={{width : '92%'}} onKeyDown={(e) => {e.key === "Enter" && loadCustomTokenInfo(e) }} onChange={(e) => handleChangeTokenName(e)}>                
                </input>                
                { isMngTokenLoading && <i className='fas fa-spinner fa-pulse fa-1x ml-10'></i> }
                <div style={{height:25}} className='mt-5'>
                    { symbolTokenNew && <p><img src={imgTokenNew} className='ml-10' style={{width:20}}></img> <span className='ml-10'>{symbolTokenNew}</span><span className='ml-10' style={{fontSize:8, color:'#777777'}}>{nameTokenNew}</span></p> }
                    { errMsg && <p >{errMsg}</p>}
                </div>
                
                </div>
                <div className="actions">                
                    <button className="site-btn mr-30" style={manageToken ? {opacity :1} : {opacity:0.2}}
                        onClick={() => {
                            
                            const _key = LSKEY_NEWTOKEN + chainId + "_" + accountid;                            
                            if(manageToken) {
                                let userManageToken = localStorage.getItem(_key);
                                if (userManageToken) {
                                    let temp = JSON.parse(userManageToken);
                                    const testItem = temp.filter((item) => {
                                        return item.address === manageToken.address;
                                    });

                                    if (testItem.length === 0) {
                                        temp.push(manageToken);
                                        localStorage.setItem(_key, JSON.stringify(temp));
                                    }                                    
                                } else {
                                    let temp = [];
                                    temp.push(manageToken);
                                    localStorage.setItem(_key, JSON.stringify(temp));
                                }
                                updateTokenList();
                                setManageToken();
                                setErrorMsg();
                                close();
                            }
                            // localStorage.removeItem(_key);
                            
                        }}
                        disabled={!manageToken}
                    >
                        Import Token
                    </button>
                </div>
            </div>
            )}
        </Popup>
    }

    return (

        <>
            <header className="header-area">
                <div className="humberger-bar d-lg-none">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-xxl-3 col-md-2">
                            <div className="logo">
                                <a href="./index.html"><img src="./assets/img/logo/logo.svg" alt="" /></a>
                            </div>
                        </div>
                        <div className="col-xxl-9 col-md-10">
                            <div className="header-right">
                                <div className="mainmenu">
                                    <ul className="mb-xs-30">
                                        <li><a href="#" style={{ textDecoration: 'none' }}>Home</a></li>
                                        {/* <li><a href="#" style={{ textDecoration: chainId == CH_BSC ? 'underline' : '' }} onClick={() => {changeChain(CH_BSC);}}>BSC Chain</a></li> */}
                                        <li><a href="#" style={{ textDecoration: chainId == CH_GOERLI ? 'underline' : '' }} onClick={() => {changeChain(CH_GOERLI);}}>Goerli</a></li>
                                        <li><a href="#" style={{ textDecoration: chainId == CH_BSC ? 'underline' : '' }} onClick={() => {changeChain(CH_BSC);}}>BSC</a></li>
                                        {/* <li><a href="#" style={{ textDecoration: chainId == CH_BSC ? 'underline' : '' }} onClick={() => {changeChain(CH_BSC);}}>Binance</a></li>
                                        <li><a href="#" style={{ textDecoration: chainId == CH_ETH ? 'underline' : '' }} onClick={() => {changeChain(CH_ETH);}}>Ethereum</a></li> */}
                                    </ul>

                                    {/* <div className="inline-list g-2 d-lg-none">
                                    <a href="#" className="site-btn">Connect Wallet</a>
                                </div> */}
                                </div>
                                <div className="inline-list g-2 d-none d-lg-flex">
                                    {
                                        acc ? <span className="site-btn" onClick={disconnet}>{accountid?.substring(0, 6) + ' .... ' + accountid?.substring(accountid?.length -6)}</span> :
                                            <span className="site-btn" onClick={onConnect}>Connect Wallet</span>
                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <LoadingOverlay
                active={isActiveLoading}
                spinner
                styles='content'
                text='Under processing ... '
            >
                <section className="dashboard pt-200 pb-150 pt-xs-100 pb-xs-100 pt-md-150 pb-md-120">
                    <div className="el-bg bg-attachment" style={{ "backgroundImage": "url(./assets/img/dashboard/bg.png)", "backgroundColor": "#121212" }} ></div>
                    <div className="container">
                        <div className="dashboard-title text-center mb-40 mb-xs-30">
                            <h2 className="font-1 fw-500">OpenAI Powered Price Stabilizer For <span className="text-theme2">Crypto Tokens</span></h2>
                        </div>

                        <div className="dashboard-content position-relative">
                            <h5 className="font-1">PriceAI Protocol Stabilizes Price for Tokens on {CHAIN_INFO[chainIdSaved]?.nativeCurrency.symbol} Chain</h5>
                            <div className="dropdown-box" id='dpbox'>
                                <button className="dropdown-title" onClick={handleDropDownContent}>
                                How to Use the Platform <img src="./assets/img/dashboard/angle-circle-down.png" alt="" />
                                </button>

                                <div className="dropdown-content">
                                    <p><b>1.</b> Connect Web3 Wallet. Wallet address & total amount in BNB that needs to be stabilized.</p>
                                    <p><b>2.</b> Click Stabilize Token Price Button.</p>
                                    <p><b>3.</b> PriceAI will work in the background and display the amount, wallet addresses and time frame for each transaction.</p>
                                    <p><b>4.</b> A private note is downloaded to your system which consists of the wallet address and private key to access the wallet.</p>
                                    <p><b>5.</b> Check the message displayed carefully and click the submit button.</p>
                                    <p><b>6.</b> PriceAI will submit the transaction and distribute the funds anonymously.</p>
                                </div>
                            </div>

                            <div action="#" className="dashboard-form">
                                <div className="row g-4 g-md-5">
                                    {/* <div className="col-md-6 col-lg-4">
                                        <div className="dashboard-input">
                                            <h5 className="font-1">Connected to :</h5>
                                            {
                                                acc ? <span>{accountid}</span> :
                                                    <button className="site-btn" onClick={onConnect}>Connect Wallet</button>
                                            }

                                        </div>
                                    </div> */}
                                    <div className="col-md-6 col-lg-4">
                                        <div className="dashboard-input">
                                            {/* <select onChange={(e) => {handleToken(e)}} className='nice-select'>
                                                <option value='0'>{CHAIN_INFO[chainIdSaved]?.nativeCurrency.symbol}</option>
                                                <option value='0x8301F2213c0eeD49a7E28Ae4c3e91722919B8B47'>BUSD</option>
                                                <option value='0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06'>LINK</option>
                                            </select> */}
                                            <Select
                                                name="tokens"
                                                options={tokenList}
                                                value={tokenInfo}
                                                styles={customStyles}
                                                disabled={acc && tokenList && false}
                                                onChange={(e) => {handleToken(e)}}
                                                classNamePrefix="react-select"
                                                getOptionLabel={(option) => option.symbol}
                                                getOptionValue={(option) => option.address} // It should be unique value in the options. E.g. ID
                                                components={{ Option: IconOption }}
                                            />
                                            {popupCont()}
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-lg-4">
                                        <div className="dashboard-input">
                                            <h5 className="font-1">Total {currency} in the wallet :</h5>
                                            <span>{mybalance} {currency}</span>
                                        </div>                                        
                                    </div>
                                    
                                    <div className="col-md-6 col-lg-4">
                                        <div className="dashboard-input">
                                            <h5 className="font-1">Enter Amount :</h5>
                                            <input type="number" id='in_amt_total' value={depositAmt} min='0' max='1000' onChange={(event) => { handleAmt(event) }} />
                                        </div>
                                        {Number(depositAmt) === 0 &&
                                            <span style={{ color: '#f00', fontSize: 12 }}>Amount should not be 0</span>
                                        }
                                    </div>                                    
                                </div>

                                <div className="section-btn text-center mt-20 mt-xs-30 mt-md-40">
                                    {
                                        enableStabilize && <button className="site-btn mr-30" type="submit" onClick={generateWalletData}>Stabilize Token Price</button>
                                    }                                    
                                </div>

                                <div className="mt-10 walletinfo-wrapper">
                                    {
                                        !enableStabilize && 
                                        <TextTyper text={walletsInfoTxt} interval={20} Markup={"pre"} />
                                    }
                                </div>

                                <div className="section-btn text-center mt-30 mt-xs-30 mt-md-40">
                                    <button className="site-btn" type="submit" onClick={executeDeposit}>Submit Transaction</button>
                                    {/* <button className="site-btn ml-150" type="submit" onClick={clearWalletData}>Clear</button> */}
                                </div>                                
                            </div>

                            <div className="dashboard-footer mt-30 mt-xs-20">
                                <ul>
                                    <li><b>Service Fee :</b>0.5%</li>
                                    <li><b>Contract :</b><a target="_blank" rel="noreferrer" href={acc &&  CHAIN_INFO[chainIdSaved].blockExplorerUrls + 'address/' + addrs} style={{textDecoration:'underline'}}>{acc && addrs}</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div id="footer" className="footer-area pt-200 pt-xs-100 pt-md-150">
                        <div className="container">
                            <div className="section-title text-center mb-60 mb-xs-40 mb-md-50">
                                <h2 className="font-1 fw-500">Get In Touch</h2>
                            </div>

                            <div className="social-area">
                                <ul className="inline-list g-2 g-md-3 align-items-center justify-content-center">
                                    <li><a href="https://twitter.com/_priceai" target="_blank" className="circle-icon" rel="noreferrer"><i className="fa-brands fa-twitter"></i></a></li>
                                    <li><a href="https://t.me/PriceAiOfficial" target="_blank" className="circle-icon" rel="noreferrer"><i className="fa-solid fa-paper-plane"></i></a></li>
                                    <li><a href="#" target="_blank" className="circle-icon" rel="noreferrer"><i className="fa-brands fa-instagram"></i></a></li>
                                    <li><a href="#" target="_blank" className="circle-icon" rel="noreferrer"><i className="fa-sharp fa-solid fa-m"></i></a></li>
                                    <li><a href="#" target="_blank" className="circle-icon" rel="noreferrer"><i className="fa-brands fa-github"></i></a></li>
                                    <li><a href="#" target="_blank" className="circle-icon" rel="noreferrer"><i className="fa-brands fa-reddit-alien"></i></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            </LoadingOverlay>

            <NotificationContainer />
        </>
    );
}


export default Collections;