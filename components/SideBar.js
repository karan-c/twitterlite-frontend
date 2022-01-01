import { useState } from "react"

export default function SideBar() {
    const [selectedOption, setSelectedOption] = useState(0)

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
            {sidebarOptions.map((item, idx) => <div className={"sidebar-option" + (selectedOption === item.id ? " blue-option" : " gray-option cursor-pointer")}>
                <div className="icon">
                    <i class={item.iconClass}></i>
                </div>
                <div className="title">
                    {item.title}
                </div>
            </div>)}
        </div>
    )
}