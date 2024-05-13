import React, {useState, useEffect} from 'react';
import Alert from '@mui/material/Alert';
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
                {open && severity === 'success' && (
                    <Alert variant='filled' severity={severity} className='alert-success'>
                        {text}
                    </Alert>
                )}

                {open && severity === 'error' && (
                    <Alert variant='filled' severity={severity} className='alert-error'>
                        {text}
                    </Alert>
                )}
            </div>
        </div>
    );
}

export default CustomAlert;