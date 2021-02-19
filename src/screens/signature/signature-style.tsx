const styles = `
                body {
                    background: #F4F6F9;
                }
                .m-signature-pad--footer {
                    position: absolute;
                    left: 20px;
                    right: 20px;
                    height: 35px;
                }

                .m-signature-pad--footer .button.clear{
                    position: absolute;
                    top: -138px;
                    background-color: rgba(0, 0, 0, 0);
                    color: #41B67F;
                    font-weight: bold;
                    font-size: 16px;
                    transform: translate(-50%, -50%);
                    left: 95%;
                }

                .m-signature-pad--footer .button.save {
                    position: absolute;
                    width: 328px;
                    height: 56px;
                    top:280%;
                    left: 50%;
                    background-color: #F4F6F9;
                    transform: translate(-50%, -50%);
                    background-color: #41B67F;
                    color: #FFFFFF;
                }

                .m-signature-pad {
                    font-size: 10px;
                    width: 70%;
                    height: 70%;
                    margin-left: auto;
                    margin-top: 2%;
                    margin-right: auto;
                    align-content: center;
                    justify-content: center;
                    border: 1px solid #FFFFFF;
                    background-color: #FFFFFF;
                    box-shadow: 0 0px 0px rgba(0, 0, 0, 0), 0 0 0px rgba(0, 0, 0, 0) inset;
                }
                .m-signature-pad:before, .m-signature-pad:after {
                    position: absolute;
                    z-index: -1;
                    content: "";
                    width: 40%;
                    height: 0px;
                    left: 20px;
                    bottom: 0px;
                    background: transparent;
                    -webkit-transform: skew(-3deg) rotate(-3deg);
                    -moz-transform: skew(-3deg) rotate(-3deg);
                    -ms-transform: skew(-3deg) rotate(-3deg);
                    -o-transform: skew(-3deg) rotate(-3deg);
                    transform: skew(-3deg) rotate(-3deg);
                    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.4);
                }
                .m-signature-pad--body {
                    position: absolute;
                    left: 20px;
                    right: 20px;
                    top: 20px;
                    bottom: 20px;
                    border: 0px solid #FFFFFF;
                    background-color: #FFFFFF;
                }

                .m-signature-pad--body canvas {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    border-radius: 4px;
                }
                @media screen and (min-width: 900px){
                    .m-signature-pad--footer .button.clear{
                        position: absolute;
                        top: -1200%;
                        background-color: #FFFFFF;
                        color: #41B67F;
                        font-weight: bold;
                        font-size: 16px;
                        transform: translate(-50%, -50%);
                        left: 95%;
                    }

                    .m-signature-pad {
                        font-size: 10px;
                        width: 70%;
                        height: 70%;
                        margin-left: -34%;
                        margin-top: -25%;
                        align-content: center;
                        justify-content: center;
                        border: 1px solid #FFFFFF;
                        background-color: #FFFFFF;
                        box-shadow: 0 0px 0px rgba(0, 0, 0, 0), 0 0 0px rgba(0, 0, 0, 0) inset;
                    }
                }`;

export default styles;                
