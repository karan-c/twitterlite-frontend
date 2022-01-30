export default function StaticBlock(props) {
    return (
        <div className='static-block sticky-div'>
            <div className='text-1'>
                Built by &nbsp;&nbsp;
                <a href='https://github.com/karan-c' target="_blank">
                    <i className='fa-brands fa-github'></i>&nbsp;
                    <u>karan-c</u>
                </a>
            </div>
            <div className='text-2'>
                <div>Checkout the source code here</div>
                <div className='d-flex mt-1' style={{gap: "10px"}}>
                    <a href="https://github.com/karan-c/TwitterLite" target="_blank">
                        <div className='tag'>
                            <i className='fa-solid fa-code'></i> Back-end
                        </div>
                    </a>
                    <a href="https://github.com/karan-c/twitterlite-frontend" target="_blank">
                        <div className='tag'>
                            <i className='fa-solid fa-code'></i> Front-end
                        </div>
                    </a>
                </div>
            </div>
        </div>
    )
}