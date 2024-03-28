import HomeIcon from '@mui/icons-material/Home';
import FaceIcon from '@mui/icons-material/Face';

export const MenuItems = [
    {
        name: 'Acasă',
        route: '/dashboard',
        icon: <HomeIcon/>
    },
    {
        name: 'Pacienți',
        route: '/patients',
        icon: <FaceIcon/>
    }
];