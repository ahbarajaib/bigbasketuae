import React from 'react'
import { Helmet } from 'react-helmet'
const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={keywords} />
    </Helmet>
  )
}

Meta.defaultProps = {
  title: 'Welcome to Big Basket',
  description: 'We sell high quality food items',
  keywords: 'Buy dry fruits n Other things',
}

export default Meta
