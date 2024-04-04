import React, { Component } from 'react';

class Breadcrumb extends Component {
    render() {
        return (
            <section style={{padding:'100px 0 0 0'}} className=" d-flex ">
                <div className="container">
                   
                        <div className="col-12 mt-5" style={{display:'flex'}}>
                            <a style={{width:'50%',display:'flex',justifyContent:'center'}} href="/nft/explore-1">
                            <button className={this.props.subpage==="sale"?"activesale":""}  style={{width:'50%',border:'none',outline:'none',color:'black',fontSize:'20px',background:'none'}}>Sale</button>
                            </a>
                            <a style={{width:'50%',display:'flex',justifyContent:'center'}} href="/nft/auctions">
                            <button className={this.props.subpage==="auction"?"activesale":""}  style={{width:'50%',border:'none',outline:'none',color:'black',fonSize:'22px',background:'none'}}>Auction</button>
                            </a>
                            {/* Breamcrumb Content */}
                            {/* <div className="breadcrumb-content text-center">
                                <h2 className="m-0">{this.props.title}</h2>
                                <ol className="breadcrumb d-flex justify-content-center">
                                    <li className="breadcrumb-item"><a href="/">Home</a></li>
                                    <li className="breadcrumb-item"><a href="#">{this.props.subpage}</a></li>
                                    <li className="breadcrumb-item active">{this.props.page}</li>
                                </ol>
                            </div> */}
                        </div>
            
                </div>
            </section>
        );
    }
}

export default Breadcrumb;