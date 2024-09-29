import React from 'react'

const Footer = () => {
    const currentYear = new Date().getFullYear();

  return (
    <div><div className="main-footer text-center">
    <div className="container">
        <div className="row row-sm">
            <div className="col-md-12">
                <span>Copyright © {currentYear} <a href="#!">ProfileUp</a>. All rights reserved.</span>
            </div>
        </div>
    </div>
</div></div>
  )
}

export default Footer