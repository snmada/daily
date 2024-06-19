import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {AppBar, Container, Toolbar, Typography, Box, IconButton, Menu, MenuItem, Tooltip, Avatar, ListItemIcon} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import {MenuItems as navbarItems} from '../MenuItems.js';
import {jwtDecode} from 'jwt-decode';
import './NavBar.scss';

function NavBar({title}) 
{
    const navigate = useNavigate();
    const [anchorNavMenu, setAnchorNavMenu] = useState(false);
    const [anchorUserMenu, setAnchorUserMenu] = useState(false);
    const [userInitials, setUserInitials] = useState('');

    useEffect(() => {
        const decodedToken = jwtDecode(sessionStorage.getItem('token'));
        setUserInitials(decodedToken.lastname[0] + '' + decodedToken.firstname[0])
    }, []);

    const handleOpenNavMenu = (event) => setAnchorNavMenu(event.currentTarget);
    const handleCloseNavMenu = () => setAnchorNavMenu(false);

    const handleOpenUserMenu = (event) => setAnchorUserMenu(event.currentTarget);
    const handleCloseUserMenu = () => setAnchorUserMenu(false);

    const signout = () => {
        sessionStorage.removeItem('token');
        navigate('/');
    };

    return (
        <AppBar className='appbar' position='sticky' sx={{backgroundColor: '#FBFBFB', padding: '3px 15px'}} elevation={3}>
            <Container maxWidth='xl'>
                <Toolbar disableGutters>
                    <Typography className='title' sx={{display: {xs: 'none', md: 'none', lg: 'flex'}}}>{title}</Typography>
                    <Box sx={{flexGrow: 1, display: {xs: 'flex', lg: 'none'}}}>
                        <IconButton aria-controls='menu' onClick={handleOpenNavMenu}><MenuIcon/></IconButton>
                        <Menu
                            id='menu'
                            sx={{display: {xs: 'block', md: 'block', lg: 'none'}}}
                            anchorEl={anchorNavMenu}
                            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                            transformOrigin={{horizontal: 'left', vertical: 'top'}}
                            keepMounted
                            open={Boolean(anchorNavMenu)}
                            onClose={handleCloseNavMenu}
                            disableScrollLock={true}
                        >
                            {navbarItems.map((value, key) => (
                                <MenuItem key={key} id={window.location.pathname.match(value.route)? 'active' : ''} onClick={() => {navigate(value.route)}}>
                                    <Typography textAlign='center'>{value.name}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    
                    <Typography sx={{flexGrow: 1, display: {xs: 'flex', md: 'flex', lg: 'none'}, color: 'black', fontSize: '20px'}}>DAILY</Typography>
                    
                    <Box sx={{flexGrow: 0, marginLeft: 'auto'}}>
                        {userInitials && <IconButton onClick={handleOpenUserMenu}><Avatar sx={{background: '#9BB0C1'}}>{userInitials}</Avatar></IconButton>}
                        <Menu
                            id='menu-user'
                            sx={{mt: '45px'}}
                            anchorEl={anchorUserMenu}
                            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                            transformOrigin={{horizontal: 'right',  vertical: 'top'}}
                            keepMounted
                            open={Boolean(anchorUserMenu)}
                            onClose={handleCloseUserMenu}
                            disableScrollLock={true}
                        >
                            <MenuItem onClick={signout}>
                                <ListItemIcon>
                                    <LogoutIcon/>
                                </ListItemIcon>
                                <Typography textAlign='center'>Deconectare</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default NavBar;