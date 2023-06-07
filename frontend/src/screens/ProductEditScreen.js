import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Form, Button,Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { listProductDetails, updateProduct } from '../actions/productActions'
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants'

const ProductEditScreen = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [image, setImage] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [prices, setPrices] = useState([])
  const [countInStock, setCountInStock] = useState(0)
  const [description, setDescription] = useState('')
  const [uploading, setUploading] = useState(false)

  const dispatch = useDispatch()

  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails

  const productUpdate = useSelector((state) => state.productUpdate)
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET })
      navigate('/admin/productlist')
    } else {
      if (!product.name || product._id !== id) {
        dispatch(listProductDetails(id))
      } else {
        setName(product.name)
        setImage(product.image)
        setBrand(product.brand)
        setCategory(product.category)
        setPrices(product.prices)
        setCountInStock(product.countInStock)
        setDescription(product.description)
      }
    }
  }, [dispatch, navigate, id, product, successUpdate])
  const axiosInstance = axios.create({baseURL:process.env.REACT_APP_API_URL})

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('image', file)
    setUploading(true)
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
      const { data } = await axiosInstance.post('/api/upload', formData, config)
      setImage(data)
      setUploading(false)
    } catch (error) {
      console.error(error)
      setUploading(false)
    }
  }

  const handlePriceChange = (index, field, value) => {
    const updatedPrices = [...prices]
    updatedPrices[index] = {
      ...updatedPrices[index],
      [field]: value,
    }
    setPrices(updatedPrices)
  }

  const handleQuantityChange = (quantity) => {
    const updatedPrices = []
    for (let i = 0; i < quantity; i++) {
      updatedPrices.push({ qty: 1, price: 1 })
    }
    setPrices(updatedPrices)
  }

  const submitHandler = (e) => {
    e.preventDefault()
    const newPrice = prices.filter((p) => p.qty && p.price)
    dispatch(
      updateProduct({
        _id: id,
        name,
        prices: newPrice,
        image,
        brand,
        category,
        description,
        countInStock,
      })
    )
  }

  return (
    <>
      <Link to='/admin/productlist' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Product</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='name'
                placeholder='Enter name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='quantity'>
              <Form.Label>No of product quantities Eg: 500gm, 1kg, 3kg</Form.Label>
              <Form.Select
                value={prices.length}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
              >
                <option value='1'>1</option>
                <option value='2'>2</option>
                <option value='3'>3</option>
                <option value='4'>4</option>
              </Form.Select>
            </Form.Group>

            {prices.map((price, index) => (
                <Row key={index}>
                  <Col xs={6} sm={6} md={6} lg={6}>
                    <Form.Group controlId={`qty${index}`}>
                      <Form.Label>Qty {index + 1}</Form.Label>
                      <Form.Control
                        type='number'
                        placeholder='Enter qty'
                        value={price.qty}
                        onChange={(e) => handlePriceChange(index, 'qty', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={6} sm={6} md={6} lg={6}>
                    <Form.Group controlId={`price${index}`}>
                      <Form.Label>Price {index + 1}</Form.Label>
                      <Form.Control
                        type='number'
                        placeholder='Enter price'
                        value={price.price}
                        onChange={(e) => handlePriceChange(index, 'price', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              ))}


            <Form.Group controlId='image'>
              <Form.Label>Image</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter image url'
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control>
              <Form.Control
                type='file'
                id='image-file'
                label='Choose File'
                onChange={uploadFileHandler}
              />
              {uploading && <Loader />}
            </Form.Group>

            <Form.Group controlId='brand'>
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter brand'
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='countInStock'>
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter countInStock'
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='category'>
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value=''>Select a category</option>
                <option value='spices'>Spices</option>
                <option value='legumes'>Legumes</option>
                <option value='grains'>Grains</option>
                <option value='cereals-and-pasta'>Cereals &amp; Pasta</option>
                <option value='sweeteners'>Sweeteners</option>
                <option value='nuts-and-seeds'>Nuts &amp; Seeds</option>
                <option value='sauces'>Sauces</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId='description'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea" rows={3} 
                placeholder='Enter description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type='submit' variant='primary'>
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  )
}

export default ProductEditScreen
