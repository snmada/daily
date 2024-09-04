import React, {useState, useEffect} from 'react';
import {Grid, Typography, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Alert, Box, Tooltip} from '@mui/material';
import {DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarDensitySelector, GridToolbarFilterButton} from '@mui/x-data-grid';
import * as yup from 'yup';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import NavBar from '../../components/NavBar/NavBar.js';
import SideBar from '../../components/SideBar/SideBar.js';
import './Patient.scss';
import {roRO} from '@mui/x-data-grid/locales';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CustomAlert from '../../components/CustomAlert/CustomAlert.js';

const initialState = {firstname: '', lastname: '', CNP: '', phone: '', address: '', country: ''};

const columns = [
    {field: 'uuid_patient', headerName: 'uuid_patient', width: 80, headerClassName: 'header'},
    {field: 'id', headerName: 'ID', width: 70, headerClassName: 'header'},
    {field: 'lastname', headerName: 'Nume', width: 260, headerClassName: 'header'},
    {field: 'firstname', headerName: 'Prenume', width: 260, headerClassName: 'header'},
    {field: 'CNP', headerName: 'CNP', width: 250, headerClassName: 'header'},
    {field: 'birthdate', headerName: 'Data nașterii', width: 200, headerClassName: 'header'},
    {field: 'age', headerName: 'Vârsta', type: 'number', width: 150, align: 'left', headerAlign: 'left', headerClassName: 'header'},
    {field: 'phone', headerName: 'Telefon', flex: 1, headerClassName: 'header'}
];

function Patient()
{
    const token = sessionStorage.getItem('token');
    const decoded_token = jwtDecode(sessionStorage.getItem('token'));
    const [rows, setRows] = useState([]);
    const theme = createTheme(roRO);
    const filteredColumns = columns.filter((column) => !['uuid_patient', 'id'].includes(column.field));

    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);

    const [formData, setFormData] = useState(initialState);

    const handleChange = (event) => setFormData({...formData, [event.target.name]: event.target.value});

    const handleClickOpen = () => setOpen(true);
    
    const handleClose = () => {
        setOpen(false);
        setFormData(initialState);
        setErrorMessage('');
    };

    const [alert, setAlert] = useState(null);

    useEffect(() => {
        if(alert) 
        {
            setTimeout(() => {
                setAlert(null); 
                setFormData(initialState);
            }, 5000); 
        }
    }, [alert]);

    const schema = yup.object().shape({
        firstname: yup.string().required('Câmp obligatoriu').matches(/[a-zA-ZăâîșțĂÂÎȘȚ -]+$/, 'Sunt acceptate doar caractere alfabetice'),
        lastname: yup.string().required('Câmp obligatoriu').matches(/[a-zA-ZăâîșțĂÂÎȘȚ -]+$/, 'Sunt acceptate doar caractere alfabetice'),
        CNP: yup.string().required('Câmp obligatoriu').min(13, 'CNP invalid').max(13, 'CNP invalid'),
        phone: yup.string().required('Câmp obligatoriu').matches(/^[0-9]+$/, 'Sunt acceptate doar cifre')
                    .min(10, 'Lungimea maximă este de 10 cifre').max(10, 'Lungimea maximă este de 10 cifre'),
        address: yup.string().max(45, 'Lungimea maximă este de 45 de caractere'),
        country: yup.string().ensure().when('address', {
            is: (address) => address && address.trim().length > 0,
            then: () => yup.string().required('Câmp obligatoriu')
        }).max(45, 'Lungimea maximă este de 45 de caractere')

    });

    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit =  () => {
        axios.post('http://localhost:3001/patient/add', {
            uuid_doctor: decoded_token.uuid_doctor, 
            lastname: formData.lastname,
            firstname: formData.firstname,
            CNP: formData.CNP,
            phone: formData.phone,
            address: formData.address,
            country: formData.country
        },
        {
            headers:{
                'authorization': `Bearer ${token}`
            }
        })
        .then((response) => {
            if(response.status === 200)
            {
                navigate(`/patients/${response.data.uuid_patient}`);
            }
        })
        .catch((error) => {
            if(error.response.status === 409) 
            {
                setErrorMessage(error.response.data);
            }
            else
            {
                setAlert({
                    severity: 'error',
                    text: 'A intervenit o eroare. Vă rugăm să încercați mai târziu.'
                });
                handleClose(true);
            }
        });
    };

    const CustomTooltip = ({title, children}) => {
        return(
            <Tooltip title={<h2 style={{color: '#FBFBFB', padding: '5px'}}>{title}</h2>} enterDelay={500}>
                {children}
            </Tooltip>
        );
    };

    const ButtonProps = () => {
        return{
            button:{
                variant: 'contained',
                style:{
                    backgroundColor: '#BFDCE5',
                    color: '#191919',
                    marginBottom: '10px',
                    fontSize: '14px',
                    paddingLeft: '20px',
                    paddingRight: '20px'
                }
            }
        }
    };

    const CustomToolbar = () => {
        const buttonProps = ButtonProps();
        return(
            <GridToolbarContainer>
                <GridToolbarFilterButton slotProps={buttonProps}/>
                <GridToolbarDensitySelector slotProps={buttonProps}/>
                <GridToolbarExport slotProps={buttonProps} csvOptions={{disableToolbarButton: true}}/>
            </GridToolbarContainer>
        );
    };

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = () => {
        axios.get(`http://localhost:3001/patient/data/${decoded_token.uuid_doctor}`,
        {
            headers:{
                'authorization': `Bearer ${token}`
            }
        })
        .then((response) => {
            if(response.status === 200)
            {
                setRows(response.data);
            }
        })
        .catch((error) => {
            (error.response.status === 500) && alert('A intervenit o eroare. Vă rugăm să încercați mai târziu.');
        });
    }

    return(
        <Grid container className='patient'>
            {alert && (<CustomAlert severity={alert.severity} text={alert.text}/>)}
            <SideBar />
            <Grid item className='main-content'>
                <NavBar title=''/>
                <Grid container className='grid-container'>
                    <Grid item xs={12} pb={2}>
                        <Button variant='contained' className='button' startIcon={<PersonAddIcon/>} onClick={handleClickOpen}>PACIENT NOU</Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Box className='box'>
                            <ThemeProvider theme={theme}>
                                <DataGrid
                                    rows={rows}
                                    columns={filteredColumns.map((column) => ({
                                        ...column,
                                        renderCell:(params) => {
                                            return(
                                                <CustomTooltip title={<span>Vezi profilul pacientului - <br/> {params.row.lastname} {params.row.firstname}</span>}>
                                                    <div style={{cursor: 'pointer'}} onClick={() => navigate(`/patients/${params.row.uuid_patient}`)}>
                                                        {params.value}
                                                    </div>
                                                </CustomTooltip>
                                            );
                                        }
                                    }))}
                                    initialState={{
                                        pagination:{
                                            paginationModel:{
                                                pageSize: 7
                                        }}
                                    }}
                                    pageSizeOptions={[7]}
                                    disableRowSelectionOnClick
                                    slots={{toolbar: CustomToolbar}}
                                />
                            </ThemeProvider>
                        </Box>
                    </Grid>
                </Grid>
                <Dialog open={open} onClose={handleClose} className='dialog-patient'>
                    <DialogTitle sx={{textAlign: 'center', padding: '40px 30px 0px 30px'}}>Formular pentru adăugarea unui pacient nou</DialogTitle>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <DialogContent sx={{width: '600px', padding: '30px'}}>

                            <DialogContentText >
                                Te rugăm să introduci următoarele date: 
                            </DialogContentText>
                        
                            <Grid container py={2}>
                                <Grid item xs={6} py={1}>
                                    <TextField 
                                        {...register('lastname')} 
                                        value={formData.lastname} 
                                        name='lastname' 
                                        type='text' 
                                        label='Nume *' 
                                        variant='outlined' 
                                        onChange={handleChange} 
                                        fullWidth
                                    />
                                    <Typography className='error'>{errors.lastname?.message}</Typography>
                                </Grid>
                                <Grid item xs={6} py={1} pl={1}>
                                    <TextField 
                                        {...register('firstname')} 
                                        value={formData.firstname} 
                                        name='firstname' 
                                        type='text' 
                                        label='Prenume *' 
                                        variant='outlined' 
                                        onChange={handleChange} 
                                        fullWidth
                                    />
                                    <Typography className='error'>{errors.firstname?.message}</Typography>
                                </Grid>
                                <Grid item xs={12} py={1}>
                                    <TextField 
                                        {...register('CNP')} 
                                        value={formData.CNP} 
                                        name='CNP' 
                                        type='text' 
                                        label='CNP (Cod Numeric Personal) *' 
                                        variant='outlined' 
                                        onChange={handleChange} 
                                        fullWidth
                                    />
                                    <Typography className='error'>{errors.CNP?.message}</Typography>
                                </Grid>
                                <Grid item xs={12} py={1}>
                                    <TextField 
                                        {...register('phone')} 
                                        value={formData.phone} 
                                        name='phone' 
                                        type='text' 
                                        label='Telefon *' 
                                        variant='outlined' 
                                        onChange={handleChange} 
                                        fullWidth
                                    />
                                    <Typography className='error'>{errors.phone?.message}</Typography>
                                </Grid>
                                <Grid item xs={7} py={1}>
                                    <TextField 
                                        {...register('address')} 
                                        value={formData.address} 
                                        name='address' 
                                        type='text' 
                                        label='Domiciliu' 
                                        variant='outlined' 
                                        onChange={handleChange} 
                                        fullWidth
                                    />
                                    <Typography className='error'>{errors.address?.message}</Typography>
                                </Grid>
                                <Grid item xs={5} py={1} pl={1}>
                                    <TextField 
                                        {...register('country')} 
                                        value={formData.country} 
                                        name='country' 
                                        type='text' 
                                        label='Țară' 
                                        variant='outlined' 
                                        onChange={handleChange} 
                                        fullWidth
                                    />
                                    <Typography className='error'>{errors.country?.message}</Typography>
                                </Grid>
                            </Grid>   
                            {errorMessage &&  <Alert severity='error' width={'100%'}>{errorMessage}</Alert>}
                        </DialogContent>
                        <DialogActions className='dialog-actions'>
                            <Button className='cancel-button' variant='outlined' onClick={handleClose}>Anulează</Button>
                            <Button className='save-button' variant='contained' type='submit'>Salvează</Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </Grid>
        </Grid>
    );
}

export default Patient;