import React from "react";
 
function Footer(props) {
    // The first commit of Material-UI
    const getCurrentYear = () => {
        return new Date().getFullYear();
    };
 

    return (
        <footer className="footer">
            <div className="footer-copyright grey darken-4">
                <div className="container">
                Powered by Beats Health © {new Date().getUTCFullYear()}. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
export default Footer;