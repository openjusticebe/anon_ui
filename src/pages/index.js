import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"
import "../styles/style.scss"
import Button from 'react-bootstrap/Button';

import { FaBeer } from 'react-icons/fa';

const IndexPage = () => (
  <Layout>
    <SEO title="Anon Api Test" />
    <h1>Hi people</h1>
    <p>Welcome to your new Gatsby site. Want a <FaBeer /> ?</p>
    <p>Now go build something great.</p>
    <p className="poulet">Or try something<span> new !</span></p>
    <Button>Coucou</Button>
    <div className="row">
        <div className="col-6">Bouh</div>
        <div className="col-4">Bouh</div>
    </div>
    <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
      <Image />
    </div>
    <Link to="/page-2/">Go to page 2</Link>
  </Layout>
)

export default IndexPage
