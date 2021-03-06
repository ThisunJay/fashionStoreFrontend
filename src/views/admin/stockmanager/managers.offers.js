/*  eslint-disable */
import React, { Component } from 'react';
import { Link } from "react-router-dom";
import AdminSidebar from '../../../components/AdminSidebar'
import '../../../asserts/commoncss/sidebar.css'
import '../../../asserts/commoncss/admin.product.css'
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import Config from "../../../controllers/Config";
import moment from 'moment'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faEye,  faPlusSquare , faTrash} from '@fortawesome/free-solid-svg-icons'
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import CreatableSelect from 'react-select/creatable';
import { getAllProductsSimple} from '../../../controllers/Products'
import M_Manager from '../../../controllers/Manager'
import { Modal } from 'react-bootstrap';
import image from '../../../asserts/Images/user.png'


import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";

const animatedComponents = makeAnimated();

class ManagersOffers extends Component {

    constructor(props){
        super(props);
        this.state = {
            showUserModal: false,
            title : '',
            stitle : '',
            discount : '',
            size : '12',
            simpleproducts : [],
            category : {},
            categories : [],
            products : [],
            files : [] ,
            errors : {} ,
            offers:[],
            viewOffer: '',

        }
    }

    componentWillMount(){
        this.loadProductSimple();
        this.getAllOffers()
   }
  
   loadProductSimple = () => {
        getAllProductsSimple()
        .then( result => {
            this.setState({simpleproducts : result});
        })
        .catch ( err => {
            console.log(err);
        })
  }

    showOffer(i) {
        let offer = this.state.offers.filter(offer => offer._id == i)[0];
        offer.product_list = offer.product_list.map( item => {
            return this.state.simpleproducts.find( x => x._id == item);
        })
        this.setState({
            showUserModal: true,
            viewOffer: offer
        })
    }

    onFormSubmit = (e) => {
        e.preventDefault();
        console.log(this.state.size)
        if(this.validate()){
            M_Manager.addOffers(
                this.state.title, 
                this.state.stitle,
                this.state.discount, 
                this.state.size,
                this.state.products.map(item => item.value),
                this.state.files,
                this.props.auth.user.token,
                this.props.auth.user.type
                )
            .then( result => {
                this.clearAll();
                Config.setToast(" Offer Added Successfully" );
                this.getAllOffers()
            })
            .catch( err => {
                console.log(err);
                Config.setErrorToast(" Somthing Went Wrong!");
               
            })
           
        }
    }

    formValueChange = (e) => {
        this.setState({[e.target.name] : e.target.value });
    }

    handleChangeSizes = (newValue) => {
        this.setState({products : newValue });
    };

    formatProducts = () => {
       return this.state.simpleproducts.map(item => {
            return{
                value : item._id,
                label: <div>{ item.images.length > 0 && 
                    <img src={Config.setImage(item.images[0])} height="40px" width="40px" 
                    className="mr-2"/>}
                    {item.name}</div>
            }})
    }

    getAllOffers(){
     M_Manager.getAllOffersDetails()
        .then( result => { 
            console.log(result.data);
            this.setState({
                offers : result.data
            })
        })
        .catch( err => {
            console.log(err);
            Config.setErrorToast(" Somthing Went Wrong!"); 
        })
    }

    render(){
        const { title ,stitle , discount , size , errors, 
            products, simpleproducts , offers, viewOffer } = this.state;
        return(
            <div className="bg-light wd-wrapper">
                <AdminSidebar active={"offers"}/>
                <div className="wrapper-wx" >
                    <div className="container-fluid" >
                        <div className="row">
                            <div className="col-12">
                                <h5 className="text-dark bold-normal py-2 bg-white shadow-sm px-2 mt-3 rounded">
                                    Offers
                                    <span className={`badge mx-2 badge-success`}>
                                 Add New</span>
                                </h5>
                            </div>
                            <div className="col-12">
                                <div className="card border-0 shadow-sm rounded mt-3 bg-white pb-3 mb-3">
                                    <form className="py-2  px-3" method="POST" onSubmit={(e) => this.onFormSubmit(e)}>
                                        <div className="row">

                                            {/*---------Product Name--------------  */}
                                            <div className="col-md-6 mt-2">
                                                <h6 className="form-label py-2">Offer Title</h6>
                                                <input
                                                    type="text"
                                                    name="title"
                                                    value={title}
                                                    onChange={ (e) => this.formValueChange(e)}
                                                    placeholder="Enter Offer Title"
                                                    className="form-control" ></input>
                                                { errors.title && errors.title.length > 0 &&
                                                <h4 className="small text-danger mt-2 font-weight-bold mb-0">{errors.title}</h4>}
                                            </div>

                                            {/*---------Product Name--------------  */}
                                            <div className="col-md-6 mt-2">
                                                <h6 className="form-label py-2">Offer Sub Title</h6>
                                                <input
                                                    type="text"
                                                    name="stitle"
                                                    value={stitle}
                                                    onChange={ (e) => this.formValueChange(e)}
                                                    placeholder="Enter Offer Subtitle"
                                                    className="form-control" ></input>
                                                { errors.stitle && errors.stitle.length > 0 &&
                                                <h4 className="small text-danger mt-2 font-weight-bold mb-0">{errors.stitle}</h4>}
                                            </div>
                                            {/*---------Product Name--------------  */}
                                            <div className="col-md-6 mt-2">
                                                <h6 className="form-label py-2">Offer Discount</h6>
                                                <input
                                                    type="number"
                                                    name="discount"
                                                    value={discount}
                                                    onChange={ (e) => this.formValueChange(e)}
                                                    placeholder="Enter Offer Discount"
                                                    className="form-control" ></input>
                                                { errors.discount && errors.discount.length > 0 &&
                                                <h4 className="small text-danger mt-2 font-weight-bold mb-0">{errors.discount}</h4>}
                                            </div>
                                            <div className="col-md-6 mt-2">
                                                <h6 className="form-label py-2">Offer Size</h6>
                                                <select value={size} id="size" name="size" className="form-control" required onChange={ (e) => this.formValueChange(e) }>
                                                    <option value="12" name="size" defaultValue>Full</option>
                                                    <option value="6" name="size">Half</option>
                                                    {/* <option value="4" name="size">Quarter</option> */}
                                                </select>
                                                { errors.size && errors.size.length > 0 &&
                                                <h4 className="small text-danger mt-2 font-weight-bold mb-0">{errors.size}</h4>}
                                            </div>



                                            {/*---------Product sizes--------------  */}
                                            <div className="col-md-12 mt-2">
                                                <h6 className="form-label py-2">Products</h6>
                                                { simpleproducts.length > 0 && <Select
                                                    closeMenuOnSelect={false}
                                                    components={animatedComponents}
                                                    isMulti
                                                    defaultValue={this.state.products}
                                                    onChange={this.handleChangeSizes}
                                                    placeholder="Select Products"
                                                    options={this.formatProducts()}
                                                />}
                                                { errors.sizes && errors.sizes.length > 0 &&
                                                <h4 className="small text-danger mt-2 font-weight-bold mb-0">{errors.sizes}</h4>}
                                            </div>
                                            {/* Images------------------------------------ */}
                                            <div className="col-md-12 mt-2">
                                                <h6 className="form-label py-2">Add Banner</h6>
                                                <FilePond
                                                    ref={ref => (this.pond = ref)}
                                                    files={this.state.files}
                                                    allowMultiple={true}
                                                    onupdatefiles={fileItems => {
                                                        this.setState({
                                                            files: fileItems.map(fileItem => fileItem.file)
                                                        });
                                                    }}>
                                                </FilePond>
                                                { errors.images && errors.images.length > 0 &&
                                                <h4 className="small text-danger mt-2 font-weight-bold mb-0">{errors.images}</h4>}
                                            </div>

                                            <div className="col-md-12 mt-2">
                                                <div className="d-flex">
                                                    <button className="px-4 btn btn-dark  btn-sm bold-normal" type="submit">
                                                        <FontAwesomeIcon  icon={faPlusSquare} /> Add Offer</button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            {/* -----------------------------view offers------------------------------ */}
                            <div className="col-12">
                                <div className="card border-0 shadow-sm rounded bg-white pb-2">
                                    <h5 className="text-dark bold-normal pb-2 pt-3 bg-white px-2">
                                        All Offers
                                    </h5>
                                    <div className="table-responsive px-2">
                                        <table className="table table-stripped">
                                            <thead>
                                            <tr>
                                                <th scope="col">Title</th>
                                                <th scope="col">Discount</th>
                                                <th scope="col">Created At</th>
                                                <th scope="col">Actions</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {offers.map(item => this.displayAllUsers(item))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                      {/*======================================*/}
                {/*=============== View Offer===============*/}
                {/*======================================*/}
                <Modal
                    size="lg"
                    show={this.state.showUserModal}
                    centered
                    onHide={() => this.setState({ showUserModal: false })}
                >
                    <Modal.Header className="my-0 px-2 py-1" closeButton>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            { viewOffer && viewOffer.banner_image && 
                            <div className="col-md-5">
                                <img src={Config.setImage(viewOffer.banner_image)} className="rounded" />
                            </div>       
                            }       
                            <div className="col-md-7">
                            <h6 className="form-label pb-1">Title & subtitle</h6>
                            <h6 className="form-label text-muted">{viewOffer.title}</h6>
                            <h6 className="form-label text-muted">( {viewOffer.subtitle} )</h6>
                            
                            <h6 className="form-label pt-3 pb-1">Discount Rate</h6>
                            <h6 className="form-label text-muted">{viewOffer.discount}%</h6>

                            <h6 className="form-label pt-3 pb-1">Created Date</h6>
                            <h6 className="form-label text-muted">{moment(new Date(viewOffer.created_at)).format('YYYY MMM DD')}</h6>
                            </div>              
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                            <h6 className="form-label pt-2 pb-1">List of Products</h6>
                            {viewOffer.product_list && viewOffer.product_list.map( item => 
                                <div className="bg-light my-2 p-1">{ item.images.length > 0 && 
                                <img src={Config.setImage(item.images[0])} height="40px" width="40px" 
                                className="mr-2"/>}
                                {item.name}</div> )}
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
                </div>
            </div>
        );
    }


    displayAllUsers = item => {
        return (
            <tr key={item._id}>
                <td><h6>{item.title}</h6></td>
                <td><h6>{item.discount}%</h6></td>
                <td><h6>{moment(new Date(item.created_at)).format('YYYY MMM DD')}</h6></td>
                <td>
                    <button className="btn btn-success btn-sm px-2 mr-2 mt-1" onClick={() => this.showOffer(item._id)}>
                        <FontAwesomeIcon icon={faEye}  /> More Details
                    </button>    
                    <button className="btn btn-danger btn-sm px-2 mr-2 mt-1" onClick={() => this.deleteOffer(item._id)}>
                        <FontAwesomeIcon icon={faTrash}  />
                    </button>    
                </td>
            </tr>
        );
    }
    
    deleteOffer = item => {
        Config.setDeleteConfirmAlert(
            "", 
            "This process can't be undone. Are you sure you want to delete this offer ? ",
            () => this.clickDeleteOffer(item) ,
            () => {}
        )
    }

    clickDeleteOffer = id => {
        let offer = this.state.offers.filter(offer => offer._id == id)[0];
        let product_list = offer.product_list.map( item => {
            let p =  this.state.simpleproducts.find( x => x._id == item);
            return p._id
        })

        M_Manager.deleteOfferWithProducts(id , product_list, this.props.auth.user.token, this.props.auth.user.type )
            .then( result => {
                this.getAllOffers()
                Config.setToast("Offer Deleted Successfully" );
            })
            .catch( err => {
                console.log(err);
                Config.setErrorToast(" Somthing Went Wrong!");
            })
    } 

    validate = () => {
        let { errors , title ,stitle , discount,
             } = this.state;
        let count = 0;

        if( title.length == 0 ){
            errors.title = "Title can not be empty"
            count++
        }else{
            errors.title = ""
        }

        if( stitle.length == 0 ){
            errors.stitle = "Sub Title can not be empty"
            count++
        }else{
            errors.stitle = ""
        }

        if( discount.length == 0 ){
            errors.discount = "Discount  can not be empty"
            count++
        }else{
            errors.discount = ""
        }



        if(this.state.files.length == 0  ){
            errors.images = "At least one tag must be required"
            count++
        }else{
            errors.images = ""
        }

        this.setState({errors});
        return count == 0;
    }




    clearAll = () => {
        this.setState({
            title : '',
            stitle : '',
            size : '',
            discount : '',
            products : [],
            sizes : [],
            files : [] ,
            errors : {} ,
        });
    }
}

const mapStateToProps = state => ({
    auth: state.auth || {},
  });

export default connect(mapStateToProps)(withRouter(ManagersOffers));