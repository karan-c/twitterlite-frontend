import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function SideBar() {
    const [selectedOption, setSelectedOption] = useState(0)
    const router = useRouter()
    useEffect(() => {
        let path = router.pathname
        switch (path) {
            case '/':
                setSelectedOption(0)
                break;
            case '/feed':
                setSelectedOption(1)
                break;
            default:
                setSelectedOption(0)
                break;
        }
    })
    const sidebarOptions = [
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
        }
    ]

    return (
        <div className="sidebar-block">
            {sidebarOptions.map((item, idx) =>
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