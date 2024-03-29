// SEO.js
import React from "react";
import { Helmet } from "react-helmet";

const SEO = ({ title, description }) => (
  <Helmet>
    <title>{title}</title>
    {description && <meta name="description" content={description} />}
  </Helmet>
);

export default SEO;
