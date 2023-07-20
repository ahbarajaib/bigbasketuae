import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Meta from '../components/Meta'
import { categoryProducts } from '../actions/productActions'

const ProductCategoryScreen = () => {
  const dispatch = useDispatch()
  const { keyword, pageNumber = 1, category } = useParams()

  const productCategory = useSelector((state) => state.productCategory)
  const { loading, error, products, page, pages } = productCategory

  useEffect(() => {
    dispatch(categoryProducts(keyword, pageNumber))
  }, [dispatch, keyword, pageNumber])

  return (
    <>
      <Meta />

      <h1>{category}</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Row>
            {products.map((product) => {
              if (category && product.category.toLowerCase() !== category.toLowerCase()) {
                return null; // Skip rendering if category doesn't match
              }
              return (
                <Col key={product._id} xs={6} sm={6} md={4} lg={2} xl={2}>
                  <Product product={product} category={category} />
                </Col>
              );
            })}
          </Row>
        </>
      )}
    </>
  )
}

export default ProductCategoryScreen
