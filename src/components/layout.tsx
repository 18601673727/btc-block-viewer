/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"

import Header from "./header"
import "./layout.css"

const Layout = ({ children }: { children: React.ReactElement[] }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  const container = {
    margin: `0 auto`,
    padding: `0 1rem`,
  }

  return (
    <div
      style={{
        display: `flex`,
        flexDirection: `column`,
        minHeight: `100vh`,
      }}
    >
      <Header siteTitle={data.site.siteMetadata?.title || `Title`} />
      <div
        style={{
          minHeight: `80vh`,
          background: `white`,
        }}
      >
        <main
          style={{
            ...container,
            flex: 1,
          }}
        >
          {children}
        </main>
      </div>
      <footer>
        <div
          style={{
            ...container,
            flex: 1,
            color: `white`,
          }}
        >
          © {new Date().getFullYear()}, Built with
          {` `}
          <a href="https://www.gatsbyjs.com">Gatsby</a>, API by
          {` `}
          <a href="https://www.blockchain.com">Blockchain.com</a>
        </div>
      </footer>
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
