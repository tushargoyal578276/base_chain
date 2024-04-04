import React from 'react';

import Collections from '../components/Collections/Collections';

function ThemeOne ({acc,  web3main,prov}) {
    console.log('theme',acc)
        return (
            <Collections acc={acc} web3main={web3main} prov={prov}/>
        );
    }


export default ThemeOne;