import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function SideBar({ isLogin, profileLink }) {
    const [selectedOption, setSelectedOption] = useState(null)
    const [sideBarOptions, setSideBarOptions] = useState([])
    const router = useRouter()

    useEffect(() => {
        let sbOption = [
            {
                "id": 0,
                "title": "Global",
                "link": "/",
                "iconClass": "fa-solid fa-globe"
            },
        ]
        if (isLogin) {
            console.log(profileLink)
            sbOption.push({
                "id": 1,
                "title": "My Feed",
                "link": "/feed",
                "iconClass": "fa-solid fa-house-user"
            })
            sbOption.push({
                "id": 2,
                "title": "My Profile",
                "link": profileLink ?? `/user/${localStorage.getItem('username')}`,
                "iconClass": "fa-solid fa-user"
            })
        }
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


    return (
        <div className="sidebar-block">
            {sideBarOptions.map((item, idx) =>
                <div
                    key={"option_" + idx}
                    className={"sidebar-option" + (selectedOption === item.id ? " blue-option" : " gray-option cursor-pointer")}
                    onClick={() => {
                        if (router.pathname !== item.link) {
                            router.push(item.link)
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
    )
}