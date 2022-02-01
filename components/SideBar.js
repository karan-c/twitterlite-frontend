import { Popconfirm, Modal } from "antd"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function SideBar({ isLogin, profileLink, setIsLogin }) {
    const [selectedOption, setSelectedOption] = useState(null)
    const [sideBarOptions, setSideBarOptions] = useState([])
    const [loginModalVisible, setLoginModalVisible] = useState(false);
    const router = useRouter()

    useEffect(() => {
        let sbOption = [
            {
                "id": 0,
                "title": "Global",
                "link": "/",
                "iconClass": "fa-solid fa-globe"
            },
            {
                "id": 1,
                "title": "My Feed",
                "link": "/feed",
                "iconClass": "fa-solid fa-house-user"
            },
            {
                "id": 2,
                "title": "My Profile",
                "link": profileLink ?? `/user/${localStorage.getItem('username')}`,
                "iconClass": "fa-solid fa-user"
            }
        ]
        setSideBarOptions(sbOption)
       
    }, [isLogin, profileLink])

    useEffect(() => {
        if (router.asPath !== router.route) {
            let path = router.asPath
            let ownProfilePath = localStorage.getItem('username') ? `/user/${localStorage.getItem('username')}` : ''
            console.log(ownProfilePath, path)
            if (path === ownProfilePath) {
                setSelectedOption(2)
            }
        }
        else {
            let path = router.asPath
            if (path === '/') {
                setSelectedOption(0)
            }
            else if (path === '/feed'){
                setSelectedOption(1)
            }
        }
    }, [router])

    const handleLogout = () => {
        localStorage.clear();
        setIsLogin(false)
        if (router.asPath.includes('/feed') || router.asPath.includes('/edit-profile')) {
            router.push('/')
        }
        router.reload()
    }
    return (
        <div className="sidebar-block">
            <div>
                {sideBarOptions.map((item, idx) =>
                    <div
                        key={"option_" + idx}
                        className={"sidebar-option" + (selectedOption === item.id ? " blue-option" : " gray-option cursor-pointer")}
                        onClick={() => {
                            if (router.pathname !== item.link) {
                                if ((idx === 1 || idx === 2) && !isLogin) {
                                    setLoginModalVisible(true)
                                }
                                else {
                                    router.push(item.link)
                                }
                            }
                        }}
                    >
                        <div className="icon">
                            <i className={item.iconClass}></i>
                        </div>
                        <div className="title">
                            {item.title}
                        </div>
                    </div>
                )}
            </div>
            {isLogin &&
                <Popconfirm
                    title={"Are you sure you want to logout?"}
                    onConfirm={handleLogout}
                    okText="Yes"
                    cancelText="No"
                    placement="top"
                >
                    <div className="sidebar-option gray-option cursor-pointer">
                        <div className="icon">
                            <i className="fa-solid fa-arrow-right-from-bracket"></i>
                        </div>
                        <div className="title">
                            Logout
                        </div>
                    </div>
                </Popconfirm>
            }
            <Modal
				visible={loginModalVisible}
				okText={"Login"}
				onOk={() => {
					router.push("/login")
				}}
				onCancel={() => { setLoginModalVisible(false)}}
				cancelText={"Skip"}
			>
				<div>Please Login to perform this action</div>
			</Modal>
        </div>
    )
}