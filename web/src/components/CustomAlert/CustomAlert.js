import React, {useState, useEffect} from 'react';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import './CustomAlert.scss';

function CustomAlert({severity, text})
{
    const [open, setOpen] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setOpen(false);
        }, 5000);

        return () => clearTimeout(timer); 
    }, []);

    return(
        <div className='container'>
            <div className='overlay'>
                {
                    open && (
                        <Alert icon={<CheckIcon fontSize='inherit'/>} severity={severity} className='alert'>{text}</Alert>
                    )
                }
            </div>
        </div>
    );
}

export default CustomAlert;