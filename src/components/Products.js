import React, { useEffect, useState } from 'react'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import './Products.css';
import { setItemsPerPage, setCurrentPage } from './ProductSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, useMediaQuery, useTheme } from '@material-ui/core';
import Swal from 'sweetalert2';

function Products() {
    const [product, setProduct] = useState([]);
    const [selectedItem, setSelectedItem] = useState([]);
    const [data, setData] = useState([]);
    const currPage = useSelector((state) => state.pagination.currentPage)
    const itemsonPage = useSelector((state) => state.pagination.itemsPerPage)
    // const [isChecked, setIsChecked] = useState(false);
    const dispatch = useDispatch();
    const [addProduct, setAddProduct] = useState(false);
    const [updateProduct, setUpdateProduct] = useState(false);
    const [findID, setFindID] = useState();
    var lastIndex = currPage * itemsonPage;
    var firstIndex = lastIndex - itemsonPage;
    const [postImage, setPostImage] = useState({
        ProductImages: "",
    })
    

    const [fetchedImage, setFetchedImage] = useState([]);

    const initialValues = {
        title: "",
        category: "",
        brand: "",
        price: "",
        description: "",
        currency: "",
        description: "",
        checked: false,
        userId: "2",
    }
    const [dataToUpdate, setDataToUpdate] = useState(initialValues);

    const mainURL = process.env.REACT_APP_API_KEY

    const api = axios.create({
        baseURL: "http://192.168.1.123:8080/api/admin/product",
        headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzA3MjAwOTY0fQ.GsgfXI2aavKpgawlN5mIHTsfLUB4Xe2H1WN36RcdczE',
        },
    });


    let payload;

    payload = {
        "userId": 2,
        "pagination": {
            "limit": itemsonPage,
            "page": currPage
        }
    }

    const apiCall = async () => {
        try {
            const responseNew = await api.post('/getUserProducts', payload);
            setProduct(responseNew.data.rows)
            setData(responseNew.data.pagination)
        } catch (err) {
            console.error(err);
        }
    };  

    const [userNewProduct, setUserNewProduct] = useState(initialValues);
    useEffect(() => {

        (product) ?
            (payload = {
                "userId": 2,
                "pagination": {
                    "limit": itemsonPage,
                    "page": currPage
                }
            }) :
            (
                payload = {
                    "userId": 2,
                    "pagination": {
                        "limit": 10,
                        "page": 1
                    }
                }
            )

        apiCall();
        // eslint-disable-next-line
    }, [currPage, itemsonPage]);

    let npage, numbers, records
    if (product.length !== 0) {
        // records = product.slice(firstIndex, lastIndex)
        npage = Math.ceil(data.totalRecords / itemsonPage)
        numbers = [...Array(npage + 1).keys(1)].slice(1)
    }


    function prevPage() {
        if (firstIndex !== 0) {
            let newVar = firstIndex - itemsonPage;
            lastIndex = firstIndex
            firstIndex = newVar
            dispatch(setCurrentPage(currPage - 1))
        } else {
            dispatch(setCurrentPage(currPage))
        }
    }

    function changeCurrPage(i) {
        dispatch(setCurrentPage(i))
    }

    function nextPage() {
        console.log(product)
        if (lastIndex !== data.totalRecords) {
            let nextVar = lastIndex + itemsonPage;
            firstIndex = lastIndex
            lastIndex = nextVar
            dispatch(setCurrentPage(currPage + 1))
        }
        else {
            dispatch(setCurrentPage(currPage))
        }
    }

    function handleOpenClick() {
        setAddProduct(true);
    }

    function handleCloseClick() {
        setAddProduct(false);
    }

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('xl'))

    const handleNewInput = (e) => {
        const name = e.target.name;
        const value = e.target.value

        setUserNewProduct(prevState => ({
            ...prevState, [name]: value
        }))
    }


    function addNewItem() {

        const formdata = new FormData()
        formdata.append("title", userNewProduct.title)
        formdata.append("brand", userNewProduct.brand)
        formdata.append("category", userNewProduct.category)
        formdata.append("price", userNewProduct.price)
        formdata.append("currency", userNewProduct.currency)
        formdata.append("title", userNewProduct.title)
        formdata.append("description", userNewProduct.description)
        formdata.append("ProductImages", postImage.ProductImages)
        formdata.append("user_id", 2)
        setUserNewProduct(" ")
        setAddProduct(false)

        console.log(formdata)

        const apiAddCall = async () => {
            try {
                await api.post('/addProduct', formdata);
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Item added successfully",
                    showConfirmButton: false,
                    timer: 1500
                });
            } catch (err) {
                console.error(err);
            }
        };
        apiAddCall();
        apiCall();
    }

    function handleUpdateClose() {
        setUpdateProduct(false);
    }

    function handleUpdateOpen(id) {
        setUpdateProduct(true);

        payload = {
            "userId": 2,
            "productId": id
        }
        const apiFetchCall = async () => {
            try {
                const res = await api.post('/getProduct', payload);
                console.log(res.data, "me OG hu");
                setDataToUpdate(res.data)
                setFetchedImage(res.data.ProductImages)
                console.log(res.data.ProductImages, "me bhiiiii OG hu");
                console.log(dataToUpdate, "aaaaa", fetchedImage, "sssssssss")
            } catch (err) {
                console.error(err);
            }
        };
        setFindID(id);
        apiFetchCall(id);

    }

    function handleNewUpdatedInput(event) {
        const name = event.target.name;
        const value = event.target.value;

        setDataToUpdate((prevValues) => ({
            ...prevValues, [name]: value
        }))
    }


    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        // const base64 = await convertToBase64(file);
        setPostImage({ ...postImage, ProductImages: file });
    }

    function updateNewItem() {

        const formData = new FormData()
        formData.append("title", dataToUpdate.title)
        formData.append("brand", dataToUpdate.brand)
        formData.append("category", dataToUpdate.category)
        formData.append("price", dataToUpdate.price)
        formData.append("currency", dataToUpdate.currency)
        formData.append("description", dataToUpdate.description)
        formData.append("ProductImages", postImage.ProductImages)
        formData.append("user_id", 2)
        setUpdateProduct(false)
        console.log(formData, "godddd")

        const apiUpdateCall = async () => {
            try {
                const respo = await api.post(`/updateproduct/${findID}`, formData);
                console.log(respo.data)
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Item updated successfully",
                    showConfirmButton: false,
                    timer: 1200
                });
            } catch (err) {
                console.error(err);
            }
        };
        apiUpdateCall(findID);
        console.log(findID, "this is ID")
        apiCall();

    }

    console.log(product , "getawayyyy")
    function handleDelete(id) {
        const apiAddCall = async () => {
            try {
                await api.get(`/deleteProduct/${id}`);
                console.log("done");
            } catch (err) {
                console.error(err);
            }
        };

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                apiAddCall(id);

                Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success"
                });
                apiCall();
            }
        });
    }

    const [sorting, setSorting] = useState({ field: 'title', ascending: false })

    function applySorting(field, ascending) {
        setSorting({ key: field, ascending: ascending });

        if (field === "price") {
            const sortedProducts = [...product].sort((a, b) => {
                return a[field] - b[field]
            });

            setProduct(sorting.ascending ? sortedProducts : sortedProducts.reverse())
        }

        else {
            const sortedProducts = [...product].sort((a, b) => {
                return a[field].toLowerCase() > b[field].toLowerCase() ? 1 : -1
            });

            setProduct(sorting.ascending ? sortedProducts : sortedProducts.reverse())
        }
    }

    // const isChecked = false
    const handleChange = (e) => {
        const { name, checked } = e.target;

        if (name === "allSelect") {
            let tempUser = product.map((allProducts) => {
                return { ...allProducts, isChecked: checked }
            })
            setProduct(tempUser);
        }
        else {
            let tempUser = product.map((allProducts) => allProducts.title === name ? { ...allProducts, isChecked: checked } : allProducts)
            setProduct(tempUser);
        }
    };

    return (
        <>
            <Container className='col-xl-15 offset-xl-10' style={{ border: '1px solid pink', padding: '10px', marginTop: '100px', width: '100%', marginLeft: '300px' }}>

                <Dialog open={addProduct} onClose={handleCloseClick} style={{ height: '800px', marginTop: '100px' }}
                    className='col-xl-6 offset-xl-3 offset-yl-3' fullScreen={fullScreen} maxWidth>
                    <DialogTitle>ADD PRODUCT</DialogTitle>
                    <DialogContent>
                        <DialogContentText >
                            <div>
                                <br />
                                <label>TITLE</label>
                                <input type='text' className='form-control' name='title'
                                    placeholder='Add Title' onChange={handleNewInput} value={userNewProduct.title} />
                                <br />
                                <label>BRAND</label>
                                <input type='text' className='form-control' name='brand'
                                    placeholder='Add Brand' onChange={handleNewInput} value={userNewProduct.brand} />
                                <br />
                                <label>CATEGORY</label>
                                <input type='text' className='form-control' name='category'
                                    placeholder='Add Category' onChange={handleNewInput} value={userNewProduct.category} />
                                <br />
                                <label>PRICE</label>
                                <input type='text' className='form-control' name='price'
                                    placeholder='Add Price' onChange={handleNewInput} value={userNewProduct.price} />
                                <br />
                                <label>CURRENCY</label>
                                <input type='text' className='form-control' name='currency'
                                    placeholder='Add Currency' onChange={handleNewInput} value={userNewProduct.currency} />
                                <br />
                                <label>DESCRIPTION</label>
                                <input type='text' className='form-control' name='description'
                                    placeholder='Add Description' onChange={handleNewInput} value={userNewProduct.description} />
                                <br />
                                <label>PRODUCT IMAGES</label>
                                <input type='file' className='form-control' name='ProductImages'
                                    placeholder='Upload Images' onChange={(e) => handleFileUpload(e)} accept=".jpeg, .png, .jpg" />
                                <br />
                                <Button onClick={addNewItem} className='col-xl-2 offset-xl-3' variant='secondary' autoFocus>ADD PRODUCT  </Button>
                                <Button className='col-xl-2 offset-xl-2' onClick={handleCloseClick} variant='secondary' >CANCEL</Button>
                            </div>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>

                    </DialogActions>
                </Dialog>

                <Dialog open={updateProduct} onClose={handleUpdateClose} style={{ height: '800px', marginTop: '100px' }}
                    className='col-xl-6 offset-xl-3 offset-yl-3' fullScreen={fullScreen} maxWidth>
                    <DialogTitle>UPDATE PRODUCT</DialogTitle>
                    <DialogContent>
                        <DialogContentText >
                            <div>
                                <br />
                                <label>PRODUCT NAME</label>
                                <input type='text' className='form-control' name='title'
                                    placeholder='Add Title' onChange={handleNewUpdatedInput} value={dataToUpdate.title} />
                                <br />
                                <label>BRAND</label>
                                <input type='text' className='form-control' name='brand'
                                    placeholder='Add Brand' onChange={handleNewUpdatedInput} value={dataToUpdate.brand} />
                                <br />
                                <label>CATEGORY</label>
                                <input type='text' className='form-control' name='category'
                                    placeholder='Add Category' onChange={handleNewUpdatedInput} value={dataToUpdate.category} />
                                <br />
                                <label>PRICE</label>
                                <input type='text' className='form-control' name='price'
                                    placeholder='Add Price' onChange={handleNewUpdatedInput} value={dataToUpdate.price} />
                                <br />
                                <label>CURRENCY</label>
                                <input type='text' className='form-control' name='currency'
                                    placeholder='Add Currency' onChange={handleNewUpdatedInput} value={dataToUpdate.currency} />
                                <br />
                                <label>DESCRIPTION</label>
                                <input type='text' className='form-control' name='description'
                                    placeholder='Add Description' onChange={handleNewUpdatedInput} value={dataToUpdate.description} />
                                <br />
                                <div>
                                    {

                                        (fetchedImage.length !== 0) ?
                                            fetchedImage.map((items) => {
                                                console.log(mainURL + items.url, "items")
                                                return <div key={items.id}>
                                                    <img src={mainURL + items.url} alt="not" style={{ height: '50px', width: '80px' }} />
                                                </div>
                                            }) : ""
                                    }
                                </div>

                                <label>PRODUCT IMAGES</label>
                                <input type='file' className='form-control' name='ProductImages'
                                    placeholder='Upload Images' onChange={(e) => handleFileUpload(e)} />
                                <br />
                                <Button onClick={updateNewItem} className='col-xl-2 offset-xl-3' variant='secondary' accept=".jpeg, .png, .jpg" autoFocus>UPDATE PRODUCT  </Button>
                                <Button className='col-xl-2 offset-xl-2' variant='secondary' >DELETE</Button>
                            </div>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>

                    </DialogActions>
                </Dialog>


                <Row style={{ height: '50px' }}>
                    <Col className='col-3'>
                        <Form>
                            <Form.Group>
                                <Form.Control type='text' placeholder='Search'></Form.Control>
                            </Form.Group>
                        </Form>
                    </Col><Col></Col> <Col></Col><Col></Col><Col></Col><Col></Col>
                    <Col ><Button variant='secondary' style={{ width: '140px', marginLeft: '80px' }} onClick={handleOpenClick}>ADD PRODUCT
                    </Button></Col>
                    <Col><Button variant='secondary' className='col-xl-10 offset-xl-1'>FILTER</Button></Col>
                    <Col><Button variant='secondary' >OPTIONS</Button></Col>
                </Row>
                <Row style={{ fontSize: '23px', height: '50px' }}>
                    <Col className='col-sm-1'>
                        <input type='checkbox' onChange={handleChange} name='allSelect' />
                    </Col>
                    <Col onClick={() => applySorting('title', !sorting.ascending)}> <b> PRODUCT </b> </Col>
                    <Col onClick={() => applySorting('brand', !sorting.ascending)} > <b> BRAND</b> </Col>
                    <Col onClick={() => applySorting('category', !sorting.ascending)}> <b> CATEGORY </b> </Col>
                    <Col onClick={() => applySorting('price', !sorting.ascending)}>  <b>PRICE</b> </Col>
                    <Col> <b>DESCRIPTION</b> </Col>
                    <Col className='col-3' style={{ height: '50px' }}><b>ACTIONS</b></Col>
                </Row>

                {(product) ? product.map((allProducts) => (
                    <Row key={allProducts.id} style={{ borderBottomColor: 'grey' }} >
                        <Col className='col-sm-1'>
                            <input type='checkbox' checked={allProducts.isChecked || false} onChange={handleChange} name={allProducts.title} /></Col>
                        <Col>
                            {allProducts.title} </Col>
                        <Col> {allProducts.brand}</Col>
                        <Col> {allProducts.category}</Col>
                        <Col> ₹ {allProducts.price}/-</Col>
                        <Col> {allProducts.description}</Col>
                        <Col className='col-3' style={{ height: '90px' }}> <Button variant='success' onClick={() => handleUpdateOpen(allProducts.title)}>EDIT</Button>
                            <Button variant='success'>PREVIEW</Button>

                            <Button variant='success' onClick={() => handleDelete(allProducts.id)}>DELETE</Button></Col>
                    </Row>
                )) : ""}
                <Row>
                    <Col>
                        Showing
                    </Col>
                    <Col>
                        <select name="page" onChange={(e) => dispatch(setItemsPerPage(Number(e.target.value)))}>
                            <option value='10'>10</option>
                            <option value='20'>20</option>
                            <option value='30'>30</option>
                            <option value='50'>50</option>
                            <option value='100'>100</option>
                        </select>
                    </Col>
                    <Col>
                        <ul className='pagination'>
                            <li className='page-item '>
                                <a href="#" className='page-link'
                                    onClick={() => prevPage(currPage)}>Prev</a>
                            </li>
                            {(product.length !== 0) && numbers.map((num, i) => (
                                <li key={i} className={`page-item ${currPage === num ? 'active' : ''}`}>
                                    <a href="#" className='page-link'
                                        onClick={() => changeCurrPage(i + 1)}>{num}</a>
                                </li>
                            ))}
                            <li className='page-item'>

                                <a href="#" className='page-link'
                                    onClick={() => nextPage(currPage)}>Next</a>
                            </li>

                        </ul>

                    </Col>
                </Row>
            </Container>

        </>
    )
}

export default Products