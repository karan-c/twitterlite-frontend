import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Modal } from 'antd';

export default function FloatingMenu({ isLogin, setIsLogin, profileLink}) {
	const [menuOptions, setMenuOptions] = useState([]);
	const [loginModalVisible, setLoginModalVisible] = useState(false);
	const router = useRouter()
	useEffect(() => {
		let actions = [
			{ 
				icon: <i className='fa-solid fa-user'></i>, 
				name: 'My profile',
				link: profileLink ?? `/user/${localStorage.getItem('username')}`,
			},
			{ 
				icon: <i className='fa-solid fa-house-user'></i>, 
				name: 'My Feed',
				link: '/feed'
			},
			{ 
				icon: <i className='fa-solid fa-globe'></i>, 
				name: 'Global',
				link: '/'
			},
		];
		setMenuOptions(actions)
	}, [])

	const handleLogout = () => {
        localStorage.clear();
        setIsLogin(false)
        if (router.asPath.includes('/feed') || router.asPath.includes('/edit-profile')) {
            router.push('/')
        }
        router.reload()
	}
	
	return (
		<div className='floating-icon display-mobile'>    
			<SpeedDial
				ariaLabel="SpeedDial basic example"
				sx={{ position: 'fixed', bottom: 10, left: 10, }}
				icon={<SpeedDialIcon
					sx={{backgroundColor: '#2b90d3'}}
				/>}
				
			>
				{isLogin && <SpeedDialAction
					key={'logout'}
					icon={<i className='fa-solid fa-arrow-right-from-bracket'></i>}
					tooltipTitle={'Logout'}
					onClick={() => {
						handleLogout()
					}}
				/>}
				{menuOptions.map((action, idx) => (
					<SpeedDialAction
						key={action.name}
						icon={action.icon}
						tooltipTitle={action.name}
						onClick={() => {
							if (router.pathname !== action.link) {
								if ((idx === 0 || idx === 1) && !isLogin) {
									setLoginModalVisible(true)
								}
								else {
									router.push(action.link)
								}
							}
						}}
					/>
				))}
			</SpeedDial>
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