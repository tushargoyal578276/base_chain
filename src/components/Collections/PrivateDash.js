import React, { useEffect, useState } from 'react'
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";
import Web3 from 'web3'
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import {Decimal} from 'decimal.js';

import contractJson from '../../abi/PrivateDeposit.json'
import Erc20 from '../../abi/ERC20.json'
import { deposit_usdc, deposit_usdt, usdc, usdt, feed } from '../../abi/address'

const { toWei, fromWei, toBN, BN } = require('web3-utils')

let web3Modal;
let provider;
let selectedAccount;

// import Web3 from 'web3'
function init() {
    const providerOptions = {
        walletconnect: {
            package: WalletConnectProvider,
            options: {
                network: 'eth',
                rpc: {
                    1: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
                },
                chainId: 1
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

function PrivateDash() {
    const [acc, setacc] = useState()
    const [accountid, setaccountid] = useState();
    const [web3, setWeb3] = useState();
    const [netId, setNetId] = useState();
    const [usdtDeposit, setUsdtDeposit] = useState();
    const [usdcDeposit, setUsdcDeposit] = useState();
    const [depositAmt, setDepositAmt] = useState(0);
    const [depositQty, setDepositQty] = useState(0);
    const [enableTokenTxt, setEnableTokenTxt] = useState('Enable USDT');
    const [buyTokenTxt, setBuyTokenTxt] = useState('Buy tokens');
    const [mybalance, setMybalance] = useState();
    const [usdtCont, setUsdtCont] = useState();
    const [usdcCont, setUsdcCont] = useState();
    const [myAllownace, setMyAllownace] = useState();
    const [myTokenAmt, setMyTokenAmt] = useState();
    const [tokenType, setTokenType] = useState('USDT');

    useEffect(async () => {

        if (acc) {
            provider = await web3Modal.connect();
            let web3_2 = new Web3(provider);
            const accounts = await web3_2.eth.getAccounts();
            const _netId = await web3_2.eth.getChainId();
            setWeb3(web3_2);
            setaccountid(accounts[0]);
            setNetId(_netId);
            let _usdtDeposit = new web3_2.eth.Contract(contractJson, deposit_usdt);
            let _usdcDeposit = new web3_2.eth.Contract(contractJson, deposit_usdc);

            let usdtCont = new web3_2.eth.Contract(Erc20, usdt);
            console.log(usdtCont);
            setUsdtCont(usdtCont);

            let usdcCont = new web3_2.eth.Contract(Erc20, usdc);
            setUsdcCont(usdcCont);

            setUsdtDeposit(_usdtDeposit);
            setUsdcDeposit(_usdcDeposit);
            setProviderEvent();

            const allowance = await usdtCont.methods.allowance(accounts[0], deposit_usdt).call({ from: accounts[0] });
            let weiAllowance =  web3_2.utils.fromWei(allowance);
            setMyAllownace(weiAllowance);
        }

    }, [acc]);

    useEffect(() => {
        init();
        getAccount();
        if (web3Modal.cachedProvider) {
            setacc(true)
        }

    }, []);

    useEffect(() => {    
        if (usdcDeposit && usdcDeposit) {
            getMyBalance(tokenType);
        }    
        
    }, [usdtDeposit, usdcDeposit, tokenType]);

    useEffect(async () => {    
        if (usdtCont && usdcCont) {
            await getMyTokenAmt(tokenType);
        }    
        
    }, [usdtCont, usdcCont, tokenType]);

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
        if (window.ethereum) {
            // request change chain
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x1' }],
                });
            } catch (switchError) {
                // This error code indicates that the chain has not been added to MetaMask.
                if (switchError.code === 4902) {
                    try {
                        const data = [{
                            chainId: '0x01',
                            chainName: 'Ethereum Chain',
                            nativeCurrency: {
                                name: 'Ethereum',
                                symbol: 'ETH',
                                decimals: 18,
                            },
                            rpcUrls: ['https://mainnet.infura.io/v3/'],
                            blockExplorerUrls: ['https://etherscan.io'],
                        }]

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

    async function enableDeposit() {
        setEnableTokenTxt('In progress ..');
        if (tokenType == 'USDT') {
            try {
                const toHex = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
                await usdtCont.methods.approve(deposit_usdt, toHex).send({ from: accountid});
                NotificationManager.success('Approved USDT', 'PriceAI');
            } catch (error) {
                NotificationManager.error('Get errors in apporve USDT', 'PriceAI');
                setEnableTokenTxt('Enable ' + tokenType);
                return false;
            }                        
    
            const allowance = await usdtCont.methods.allowance(accountid, deposit_usdt).call({ from: accountid });
            let weiAllowance =  web3.utils.fromWei(allowance);
            setMyAllownace(weiAllowance);
        } else {
            try {
                const toHex = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
                await usdcCont.methods.approve(deposit_usdc, toHex).send({ from: accountid});
                NotificationManager.success('Approved USDC', 'PriceAI');
            } catch (error) {
                NotificationManager.error('Get errors in apporve USDC', 'PriceAI');
                setEnableTokenTxt('Enable ' + tokenType);
                return false; 
            }           

            const allowance = await usdcCont.methods.allowance(accountid, deposit_usdc).call({ from: accountid });
            let weiAllowance =  web3.utils.fromWei(allowance);
            setMyAllownace(weiAllowance);
        }        
    }

    async function getMyAllowance(_tokenName) {
        if (_tokenName == 'USDT') {
            const allowance = await usdtCont.methods.allowance(accountid, deposit_usdt).call({ from: accountid });
            let weiAllowance =  web3.utils.fromWei(allowance);
            setMyAllownace(weiAllowance);
        } else {
            const allowance = await usdcCont.methods.allowance(accountid, deposit_usdc).call({ from: accountid });
            let weiAllowance =  web3.utils.fromWei(allowance);
            setMyAllownace(weiAllowance);
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
        let { value, min, max } = _event.target;
        value = parseFloat(value);
        console.log(value);
        let decmalValue = new Decimal(value);
        decmalValue = decmalValue.toNumber();
        setDepositAmt(decmalValue);
        let qty = new Decimal(getQtyFromAmt(decmalValue));
        setDepositQty(qty.toNumber());
    }   

    function handleTokenType(_event) {
        let { value } = _event.target;
        setTokenType(value);
        getMyAllowance(value);
        getMyBalance(value);
        setEnableTokenTxt('Enable ' + value);
    }

    function validateDepositValues() {
        if(depositQty <= 0) {
            NotificationManager.error('Buy amount is not valid.', 'PriceAI');
            return false;
        }

        if(depositAmt <= 0){
            NotificationManager.error('Buy amount is not valid.', 'PriceAI');
            return false;
        }
        return true;
    }

    async function getMyTokenAmt(_tokenName) {

        if (_tokenName == 'USDT') {
            const total_ = await usdtCont.methods.balanceOf(accountid).call();
            let weiTotal =  web3.utils.fromWei(total_, 'mwei');
            console.log(weiTotal);
            setMyTokenAmt(weiTotal);
            return weiTotal;
        } else {
            const total_ = await usdcCont.methods.balanceOf(accountid).call();
            let weiTotal =  web3.utils.fromWei(total_, 'mwei');
            console.log(weiTotal);
            setMyTokenAmt(weiTotal);
            return weiTotal;
        }
        
    }

    function getQtyFromAmt(_amt) {
        let qty =  _amt * 1000;
        return qty;
    }

    async function getMyBalance(_tokenName) {

        let depositResultUSDT = 0;
        let depositResultUSDC = 0;
        depositResultUSDT = await usdtDeposit.methods.getDepositedQty(accountid).call().then((result) => {
            return result;
        })
            
        depositResultUSDC = await usdcDeposit.methods.getDepositedQty(accountid).call().then((result) => {
            return result;
        })

        setMybalance(Number(web3.utils.fromWei(depositResultUSDT, 'mwei')) + Number(web3.utils.fromWei(depositResultUSDC, 'mwei')));
    }

    /**
     * Make a deposit
     * @param currency Сurrency
     * @param amount Deposit amount
     */
    async function deposit(_tokenName) {

        try {
            const value = fromDecimals({ amount:depositAmt, decimals: 6 })
            const qty = fromDecimals({ amount:depositQty, decimals: 6 })

            let depositResult = false;

            if (_tokenName == 'USDT') {
                depositResult = await usdtDeposit.methods.depositToken(qty, value, 2, true).send({ from: accountid }).then((result) => {
                    if (result?.status == true) return true;
                    else return false;
                })
            } else {
                depositResult = await usdcDeposit.methods.depositToken(qty, value, 2, true).send({ from: accountid }).then((result) => {
                    if (result?.status == true) return true;
                    else return false;
                })
            }

            return depositResult;
        } catch (error) {
            return false;
        }
    }

    async function executeDeposit() {
        if (!acc) { NotificationManager.error('Please connect to wallet!', 'PriceAI'); return;}
        if (validateDepositValues() == false) return;

        setBuyTokenTxt('In progress ..');

        let _myTokenAmt = await getMyTokenAmt(tokenType);
        if (Number(_myTokenAmt) < Number(depositAmt)) {
            NotificationManager.error(tokenType + ' balance not enough ', 'PriceAI');
            setBuyTokenTxt('Buy tokens');
            return;
        }

        let depositResult = await deposit(tokenType);
        if (depositResult === false) {            
            NotificationManager.error('Get some error in processing. Please try again later', 'PriceAI');
        }

        if (depositResult === true) {
            // refresh my balance
            getMyBalance(tokenType);
            await getMyTokenAmt(tokenType);

            setDepositAmt(0);
            setDepositQty(0);
            NotificationManager.success('Successfully deposited!', 'PriceAI');            
        } else {            
            setBuyTokenTxt('Buy tokens');
        }

        setBuyTokenTxt('Buy tokens');
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
                                <a href="https://priceai.ai/"><img src="./assets/img/logo/logo.svg" alt="" /></a>
                            </div>
                        </div>
                        <div className="col-xxl-9 col-md-10">
                            <div className="header-right">
                                <div className="mainmenu">
                                    <ul className="mb-xs-30">
                                        <li><a href="https://priceai.ai/" target='_blank' style={{ textDecoration: 'none' }}>Home</a></li>
                                    </ul>

                                    {/* <div className="inline-list g-2 d-lg-none">
                                    <a href="#" className="site-btn">Connect Wallet</a>
                                </div> */}
                                </div>
                                <div className="inline-list g-2 d-none d-lg-flex">
                                    {
                                        acc ? <span className="site-btn" onClick={disconnet}>Disconnect</span> :
                                            <span className="site-btn" onClick={onConnect}>Connect Wallet</span>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <section className="dashboard pt-200 pb-150 pt-xs-100 pb-xs-100 pt-md-150 pb-md-120">
                <div className="el-bg bg-attachment" style={{ "backgroundImage": "url(./assets/img/dashboard/bg.png)", "backgroundColor": "#121212" }} ></div>
                                
                <div className="container">
                    <div className="private-sale-wrapper">
                        <div className="private-sale-title">
                            <h4><span className="font-1 fw-700">Private Sale</span></h4>
                            <h4><span className="font-1 fw-700">$50k</span></h4>
                        </div>
                        <div className="private-inner">
                            <div className='private-inner-progress'></div>
                            <div className="private-inner-box">
                                <span>$10k</span>
                                <span>$25k</span>
                                <span>$40k</span>
                            </div>
                        </div>
                    </div>                    
                </div>

                <section className="tokens-area">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-3 col-lg-2">
                                <div className="tokens-left-item">
                                    <h5 className="font-1 fw-700">Select chain</h5>
                                    <div className='neticon-wrapper'>
                                        <a href='#'><img src="assets/img/sale/icon1.svg" alt=""/></a>
                                        <a href='/sale-binance'><img src="assets/img/sale/icon3_fade.svg" alt=""/></a>
                                    </div>                                    
                                    <h6 className="font-1 fw-700 pt-20">{accountid && accountid?.substring(0, 6) + ' ... ' + accountid?.substring(accountid?.length-4)}</h6>
                                </div>
                            </div>
                            <div className="col-md-5 col-lg-7">
                                <div className="tokens-maddle-item">
                                    <h5 className="font-1 fw-700">Buy PRICE tokens</h5>
                                    <div className="token-inner mt-10">
                                        <span>{tokenType} : {myTokenAmt}</span>
                                        <div className="token-item">
                                            <div className="token-input">
                                                <input type="number" id='in_amt_b' min="0.0001" value={depositAmt} onChange={(event) => { handleAmt(event) }} />
                                            </div>
                                            <select className='select-howto' id='sel_type' onChange={(event) => { handleTokenType(event) }}>
                                                <option value="USDT">USDT</option>
                                                <option value="USDC">USDC</option>
                                            </select>
                                            {/* <Select
                                                options={options}
                                                styles={'select-howto'}
                                                formatOptionLabel={token => (
                                                    <div className="country-option">
                                                        <img src={token.image} alt="country-image" />
                                                        <span>{token.label}</span>
                                                    </div>
                                                )}
                                            ></Select> */}
                                        </div>
                                        <div className="token-item">
                                            <div className="token-input">
                                                <input value={depositQty} disabled/>
                                            </div>
                                            <a href="#"><img src="assets/img/sale/con3.svg" alt=""/> PRICE</a>
                                        </div>
                                        <img className="down-ar2" src="assets/img/sale/icon2.svg" alt=""/>	
                                    </div>
                                    <div style={{display:'flex', justifyContent:'center'}}>
                                        {myAllownace <= 0 ? <button className="site-btn" onClick={enableDeposit}>{enableTokenTxt}</button> :

                                        <button className="site-btn" onClick={executeDeposit}>{buyTokenTxt}</button>}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 col-lg-3">
                                <div className="tokens-right-item">
                                    <h5 className="font-1 fw-700">My Balance</h5>
                                    <form action="#">
                                        <input value={mybalance} disabled/>
                                        <div className="token-btn2">
                                            <a href="#">Claim PRICE</a>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="overview-main">
                            <h5 className="font-1 fw-700" >Private Sale Overview</h5>
                            <ul>
                                <li> <span><img src="assets/img/sale/ovr1.svg" alt=""/></span> 25% total Supply</li>
                                <li><span><img src="assets/img/sale/ovr3.svg" alt=""/></span> $0.001 USDT or USDC</li>
                                <li><span><img src="assets/img/sale/ovr2.svg" alt=""/></span> 100 Million tokens</li>
                                <li><span><img src="assets/img/sale/ovr4.svg" alt=""/></span> No Cliff. 28% at TGE, then 8% every alternative month for 18 months.</li>
                            </ul>
                        </div>
                    </div>
                </section>
                <div id="footer" className="footer-area pt-200 pt-xs-100 pt-md-150">
                    <div className="container">
                        <div className="section-title text-center mb-60 mb-xs-40 mb-md-50">
                            <h2 className="font-1 fw-500">Get In Touch</h2>
                        </div>

                        <div className="social-area">
                            <ul className="inline-list g-2 g-md-3 align-items-center justify-content-center">
                                <li><a href="https://twitter.com/Privatex_App" target="_blank" className="circle-icon"><i className="fa-brands fa-twitter"></i></a></li>
                                <li><a href="https://t.me/PrivateXApp" target="_blank" className="circle-icon"><i className="fa-solid fa-paper-plane"></i></a></li>
                                <li><a href="#" target="_blank" className="circle-icon"><i className="fa-brands fa-instagram"></i></a></li>
                                <li><a href="#" target="_blank" className="circle-icon"><i className="fa-sharp fa-solid fa-m"></i></a></li>
                                <li><a href="#" target="_blank" className="circle-icon"><i className="fa-brands fa-github"></i></a></li>
                                <li><a href="#" target="_blank" className="circle-icon"><i className="fa-brands fa-reddit-alien"></i></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>           
            
            <NotificationContainer />
        </>
    );
}


export default PrivateDash;