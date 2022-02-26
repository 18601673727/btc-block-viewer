import * as React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"

const Header = ({ siteTitle }: HeaderProps) => (
  <header
    style={{
      background: `#007bff`,
    }}
  >
    <div
      style={{
        margin: `0 auto`,
        padding: `0 1rem`,
        height: `10vh`,
        display: `flex`,
        alignItems: `center`,
      }}
    >
      <h1 style={{ margin: 0 }}>
        <Link
          to="/"
          style={{
            color: `white`,
            textDecoration: `none`,
          }}
        >
          {siteTitle}
        </Link>
      </h1>
    </div>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

type HeaderProps = {
  siteTitle: string
}

export default Header
