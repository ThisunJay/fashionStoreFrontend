import React, { Component } from 'react';
import MainNavbar from '../../components/MainNavbar';
import Footer from '../../components/Footer';
import Config from "../../controllers/Config";
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { insertOrder } from '../../controllers/Order'
import { string } from 'prop-types';

class Order  extends Component {
 
constructor(props){
     super(props);
     this.state = {
        loading : true,
        errors : {},
        amount : '',
        username : 'Jayamadhu Thisun',
        addressLine1: '',
        addressLine2: '',
        province: '',
        postalCode: '',
        deliveryAddress: '',
        userId: '5eaee2f5c8aa252450f5e8c4',
     }
}

componentDidMount(){
    console.log()
}

formValueChange = (e) => {
    this.setState({[e.target.name] : e.target.value });
 }

 //on form submit
 onFormSubmit = (e) => {
    e.preventDefault();
    const filtered_products = this.props.cart.cart.map( item => {
        return {
            id : item._id,
            quantity : item.quantity,
            price : item.product.price,
            selected_size : item.selected_size,
            selected_color : item.selected_color ? item.selected_color : ""
        }
    })
    
    console.log(this.props.auth.user);
    
    if(this.validate()){
        insertOrder({
            amount : Config.calcualte_total(this.props.cart.cart),
            userId : this.state.userId, 
            deliveryAddress : `${this.state.addressLine1}, ${this.state.addressLine2}, ${this.state.province}, ${this.state.postalCode}`,
            products: filtered_products,
        })
        .then( result => {
            this.clearAll();
            Config.setToast(" Category Updated Successfully" );
        })
        .catch( err => {
            console.log(err);
            Config.setErrorToast(" Somthing Went Wrong!");
           
        })
    }
}

render(){
    const { errors , amount, username, addressLine1, addressLine2, province, postalCode } = this.state;
    return(
        <div className="wrapper" >
        <MainNavbar></MainNavbar>
        <section className="product-shop spad">
            <div className="container">
                <div className="row" >
                    <div className="col-md-8" >
                <form className=" py-2  px-3" method="POST" onSubmit={(e) => this.onFormSubmit(e)}>
                    <div className="row">        
                        <div className="col-md-6">
                            <h6 className="form-label py-2">Order Amount</h6>
                            <input 
                                type="text" 
                                name="amount"
                                value={Config.calcualte_total(this.props.cart.cart) }
                                onChange={ (e) => this.formValueChange(e)}
                                placeholder="Amount" 
                                className="form-control" readOnly />
                         </div>

                        <div className="col-md-6">
                            <h6 className="form-label py-2">User Name</h6>
                            <input 
                                type="text" 
                                name="username"
                                value={username}
                                onChange={ (e) => this.formValueChange(e)}
                                placeholder="User Name"
                                className="form-control" readOnly />
                         </div>
                        
                         <div className="col-md-12">
                            <h6 className="form-label py-2">Delivery Address</h6>
                            <input 
                                type="text" 
                                name="addressLine1"
                                value={addressLine1}
                                onChange={ (e) => this.formValueChange(e)}
                                placeholder="Address Line one" 
                                className="form-control" />
                                { errors.addressLine1 && errors.addressLine1.length > 0 &&
                                    <h4 className="small text-danger mt-2 font-weight-bold mb-0">
                                        {errors.addressLine1}
                                    </h4>}
                         </div>

                         <div className="col-md-12 mt-3">
                            <input 
                                type="text" 
                                name="addressLine2"
                                value={addressLine2}
                                onChange={ (e) => this.formValueChange(e)}
                                placeholder="Address Line two" 
                                className="form-control" />
                                { errors.addressLine2 && errors.addressLine2.length > 0 &&
                                    <h4 className="small text-danger mt-2 font-weight-bold mb-0">
                                        {errors.addressLine2}
                                    </h4>}
                         </div>

                         <div className="col-md-8">
                         <h6 className="form-label py-2">Province</h6>
                            <input 
                                type="text" 
                                name="province"
                                value={province}
                                onChange={ (e) => this.formValueChange(e)}
                                placeholder="Province" 
                                className="form-control" />
                                { errors.province && errors.province.length > 0 &&
                                    <h4 className="small text-danger mt-2 font-weight-bold mb-0">
                                        {errors.province}
                                    </h4>}
                         </div>

                         <div className="col-md-4">
                         <h6 className="form-label py-2">Postal Code</h6>
                            <input 
                                type="text" 
                                name="postalCode"
                                value={postalCode}
                                onChange={ (e) => this.formValueChange(e)}
                                placeholder="Postal Code" 
                                className="form-control" />
                                { errors.postalCode && errors.postalCode.length > 0 &&
                                    <h4 className="small text-danger mt-2 font-weight-bold mb-0">
                                        {errors.postalCode}
                                    </h4>}
                         </div>

                         <div className="col-md-12 mt-2">
                                        <div className="d-flex">
                                                <button className="px-4 btn btn-dark  btn-sm bold-normal" type="submit">
                                                Add Product</button>
                                         </div>                                                      
                                        </div>               
                        </div> 
                    </form>                   
                    </div>                    
                    <div className="col-md-4" >
                    <h6 className="form-label py-2">Order Details</h6>
                    </div>                    
                </div>
                </div>
        </section>
        <Footer></Footer>
        </div>
    );
}

validate = () => {
    console.log("validate work");
    
    let { errors , amount, username, addressLine1, addressLine2, province, postalCode } = this.state;     
    let count = 0;
    
    if( addressLine1.length == 0 ){
        errors.addressLine1 = "Address line one can not be empty"
        count++
    }else{
        errors.addressLine1 = "" 
    }

    if( addressLine2.length == 0 ){
        errors.addressLine2 = "Address line two can not be empty"
        count++
    }else{
        errors.addressLine2 = "" 
    }

    if( province.length == 0 ){
        errors.province = "Province can not be empty"
        count++
    }else{
        errors.province = "" 
    }

    if( postalCode.length == 0 ){
        errors.postalCode = "Postal Code can not be empty"
        count++
    }else{
        errors.postalCode = "" 
    }

    this.setState({errors});
    return count == 0;
}

clearAll = () => {
    this.setState({
        loading : true,
        errors : {},
        amount : '',
        username : '',
        addressLine1: '',
        addressLine2: '',
        province: '',
        postalCode: '',     
    });
}

}

const mapStateToProps = state => ({
    cart : state.cart || {} ,
    auth : state.auth || {} , 
  });
  
  
  export default connect(mapStateToProps)(withRouter(Order));
