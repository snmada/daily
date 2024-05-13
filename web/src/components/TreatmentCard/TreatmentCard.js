import React, {useState, useEffect} from 'react';
import './TreatmentCard.scss';
import {Grid, Typography, Box, Button, IconButton, Dialog, TextField, DialogActions, DialogContent, DialogContentText, DialogTitle, Tooltip} from '@mui/material';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import {
    WbTwilight as WbTwilightIcon,
    WbSunny as WbSunnyIcon,
    ModeNight as ModeNightIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    Close as CloseIcon,
    TrendingFlat as TrendingFlatIcon
} from '@mui/icons-material';
import {v4 as uuidv4} from 'uuid';

const emptyTableData = [
    {index: 1, recommendation: '', morning: '', noon: '', evening: '', observation: '' },
    {index: 2, recommendation: '', morning: '', noon: '', evening: '', observation: '' },
    {index: 3, recommendation: '', morning: '', noon: '', evening: '', observation: '' },
    {index: 4, recommendation: '', morning: '', noon: '', evening: '', observation: '' }
];

function TreatmentCard({alert, setAlert})
{
    const param = useParams();
    const token = sessionStorage.getItem('token');
    const [acneType, setAcneType]= useState('');
    const [existTreatment, setExistTreatment] = useState(false);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [confirmDialog, setConfirmDialog] = useState(false);
    const handleOpenConfirmDialog = () => setConfirmDialog(true);
    const handleCloseConfirmDialog = () => setConfirmDialog(false);

    const [tableData, setTableData] = useState([
        {index: 1, recommendation: '', morning: '', noon: '', evening: '', observation: '' },
        {index: 2, recommendation: '', morning: '', noon: '', evening: '', observation: '' },
        {index: 3, recommendation: '', morning: '', noon: '', evening: '', observation: '' },
        {index: 4, recommendation: '', morning: '', noon: '', evening: '', observation: '' }
    ]);

    const addRow = () => {
        const newIndex = tableData.length + 1;
        setTableData([...tableData, {index: newIndex, recommendation: '', morning: '', noon: '', evening: '', observation: '' }]);
    };

    const handleInputChange = (e, rowIndex, columnName) => {
        const newData = [...tableData];
        newData[rowIndex][columnName] = e.target.value;
        setTableData(newData);
    };

    useEffect(() => {
        fetchAcneType();
        fetchTreatmentPlan();
    }, []);

    useEffect(() => {
        if(alert) 
        {
            setTimeout(() => {
                setAlert(null); 
            }, 5000); 
        }
    }, [alert]);

    const fetchAcneType = () => {
        axios.get(`http://localhost:3001/patient-profile/acne-type/${param.uuid_patient}`,
        {
            headers:{
                'authorization': `Bearer ${token}`
            }
        })
        .then((response) => {
            if(response.status === 200)
            {
                switch(response.data.acne_type)
                {
                    case 'juvenile':
                        setAcneType('Acnee juvenilă');
                    break;
                    case 'rosacea':
                        setAcneType('Acnee rozacee');
                    break;
                    case 'vulgaris':
                        setAcneType('Acnee vulgară');
                    break;
                    case 'cystic':
                        setAcneType('Acnee chistică');
                    break;
                }
            }
        })
        .catch((error) => {
            setAlert({
                severity: 'error',
                text: 'A intervenit o eroare. Vă rugăm să încercați mai târziu.'
            });
        });
    }

    const addTreatmentPlan = () => {
        if(!(JSON.stringify(tableData) === JSON.stringify(emptyTableData)))
        {
            const uuid_treatment_plan = uuidv4();
            const rows = tableData.map(row => ({
                ...row,
                uuid_treatment_plan: uuid_treatment_plan,
                recommendation: row.recommendation.trim() !== '' ? row.recommendation : '-',
                morning: row.morning.trim() !== '' ? row.morning : '-',
                noon: row.noon.trim() !== '' ? row.noon : '-',
                evening: row.evening.trim() !== '' ? row.evening : '-',
                observation: row.observation.trim() !== '' ? row.observation : '-',
            })).filter(row => row.recommendation !== '-' && (row.morning !== '-' || row.noon !== '-' || row.evening !== '-' || row.observation !== '-'));
    
            axios.post('http://localhost:3001/patient-profile/add-treatment-plan', {
                uuid_patient: param.uuid_patient,
                table: rows
            },
            {
                headers:{
                    'authorization': `Bearer ${token}`
                }
            })
            .then((response) => {
                if(response.status === 200)
                {
                    rows.forEach((row, index) => {
                        row.index = index + 1; 
                    });
                    setTableData(rows);
                    setExistTreatment(true);
                }
            })
            .catch((error) => {
                setAlert({
                    severity: 'error',
                    text: 'A intervenit o eroare. Vă rugăm să încercați mai târziu.'
                });
                handleClose(false);
            });
        }
    };

    const fetchTreatmentPlan = () => {
        axios.get(`http://localhost:3001/patient-profile/treatment-plan/${param.uuid_patient}`,
        {
            headers:{
                'authorization': `Bearer ${token}`
            }
        })
        .then((response) => {
            if(response.status === 200)
            {
                setTableData(response.data);
                setExistTreatment(true);
            }
        })
        .catch((error) => {
            setAlert({
                severity: 'error',
                text: 'A intervenit o eroare. Vă rugăm să încercați mai târziu.'
            });
        });
    }

    const deleteTreatmentPlan = () => {
        axios.put(`http://localhost:3001/patient-profile/delete-treatment-plan/${tableData[0].uuid_treatment_plan}`,{},
        {
            headers:{
                'authorization': `Bearer ${token}`
            }
        })
        .then((response) => {
            if(response.status === 200)
            {
                setExistTreatment(false);
                handleClose(true);
                handleCloseConfirmDialog(true);
                setTableData([
                    {index: 1, recommendation: '', morning: '', noon: '', evening: '', observation: '' },
                    {index: 2, recommendation: '', morning: '', noon: '', evening: '', observation: '' },
                    {index: 3, recommendation: '', morning: '', noon: '', evening: '', observation: '' },
                    {index: 4, recommendation: '', morning: '', noon: '', evening: '', observation: '' }
                ]);
            }
        })
        .catch((error) => {
            setAlert({
                severity: 'error',
                text: 'A intervenit o eroare. Vă rugăm să încercați mai târziu.'
            });
        });
    }

    return(
        <div className='div-treatment'>
            <Grid container className='container-treatment'>
                <Box className='title-box' sx={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <Typography className='title'>Tratament</Typography>
                    {existTreatment && 
                        <>
                            <TrendingFlatIcon sx={{color: '#61677A'}}/>
                            <Button onClick={() => {fetchTreatmentPlan(); handleOpen(true)}} variant='outlined'>VEZI SCHEMA</Button>
                        </>
                    }
                </Box>
                <Box className='diagnosis-box'>
                    <Typography className='diagnosis'>Diagnostic: {acneType !== ''? acneType : 'N/A'}</Typography>
                </Box> 
                <div className='treatment-box'>
                    {
                        existTreatment? 
                        (
                            <ul>
                                {tableData.map((val, index) => (
                                    <li key={index}>{val.recommendation}</li>
                                ))}
                            </ul>
                        )
                        :
                        (
                            <Box className='no-data-box'>
                                <Typography sx={{color: '#61677A'}} pb={2}>Nu există niciun tratament</Typography>
                                <Tooltip title={<h2>Adaugă un tratament</h2>}>
                                    <IconButton className='add-icon-button' onClick={handleOpen}>
                                        <AddIcon/>
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        )
                    }
                </div>
            </Grid>
            <Dialog className='dialog-treatment' open={open} onClose={handleClose} maxWidth='lg' fullWidth={true}>
                <Box sx={{display: 'flex', justifyContent: 'flex-end', paddingRight: '30px', paddingTop: '20px'}}>
                    <Tooltip title={<h2>Închide</h2>}>
                        <IconButton onClick={handleClose}>
                            <CloseIcon/>
                        </IconButton>
                    </Tooltip>
                </Box>
                <DialogTitle sx={{paddingTop: '5px', paddingBottom: '10px', textAlign: 'center'}}>SCHEMA DE TRATAMENT</DialogTitle>
                {
                    !existTreatment?
                    (
                        <>
                        <DialogContent className='dialog-content'>
                            <DialogContentText>
                                <Grid container className='dialog-content-text'>
                                    <Grid item xs={12} className='grid'>
                                        <table className='add-table-treatment'>
                                            <thead>
                                                <tr style={{padding: '30px'}}>
                                                    <th className='index'>RP/</th>
                                                    <th style={{padding: '30px'}}>RECOMANDARE</th>
                                                    <th><div><WbTwilightIcon/></div>DIMINEAȚA</th>
                                                    <th><div><WbSunnyIcon/></div>PRÂNZ</th>
                                                    <th><div><ModeNightIcon/></div>SEARA</th>
                                                    <th>OBSERVAȚII</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {tableData.map((row, rowIndex) => (
                                                    <tr key={rowIndex}>
                                                        <td className='index'>{row.index}</td>
                                                        {Object.keys(row).map((columnName, index) => (
                                                            (columnName !== 'index') && 
                                                            <td key={index}>
                                                                <TextField
                                                                    size='small'
                                                                    style={{width: '100%'}}
                                                                    value={row[columnName]}
                                                                    onChange={(e) => handleInputChange(e, rowIndex, columnName)}
                                                                />
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </Grid>
                                </Grid>
                                <Tooltip title={<h2>Adaugă un rând nou</h2>}>
                                    <IconButton className='icon-button' onClick={addRow}>
                                        <AddIcon/>
                                    </IconButton>
                                </Tooltip>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions className='dialog-actions'>
                            <Button className='save-button' variant='contained' onClick={() => addTreatmentPlan()}>SALVEAZĂ</Button>
                            <Button className='cancel-button' variant='outlined' onClick={handleClose}>Anulează</Button>
                        </DialogActions>
                        </>
                    )
                    :
                    (
                        <>
                        <DialogContent className='dialog-content'>
                            <DialogContentText>
                                <Grid container className='dialog-content-text'>
                                    <Grid item xs={12} className='grid'>
                                        <table className='view-table-treatment'>
                                            <thead>
                                                <tr>
                                                    <th>RP/</th>
                                                    <th>RECOMANDARE</th>
                                                    <th><div><WbTwilightIcon/></div>DIMINEAȚA</th>
                                                    <th><div><WbSunnyIcon/></div>PRÂNZ</th>
                                                    <th><div><ModeNightIcon/></div>SEARA</th>
                                                    <th>OBSERVAȚII</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {tableData.map((row, rowIndex) => (
                                                    <tr key={rowIndex}>
                                                        <td className='index'>{row.index}</td>
                                                        {Object.keys(row).map((columnName, index) => (
                                                            (columnName !== 'index' && columnName !== 'uuid_treatment_plan') && 
                                                            <td key={index}>
                                                                {row[columnName]} 
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </Grid>
                                </Grid>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions className='dialog-actions'>
                            <Button variant='outlined' className='cancel-button' startIcon={<DeleteIcon sx={{color: '#F52A2A'}}/>} onClick={handleOpenConfirmDialog}>ȘTERGE</Button>
                        </DialogActions>
                        </>
                    )
                }
            </Dialog>
            <Dialog open={confirmDialog} onClose={handleCloseConfirmDialog}>
                <DialogTitle>Confirmare Ștergere</DialogTitle>
                <DialogContent >
                    <DialogContentText>
                        Sunteți sigur că doriți să ștergeți schema de tratament?
                    </DialogContentText>
                </DialogContent>
                <DialogActions >
                    <Button onClick={handleCloseConfirmDialog} variant='outlined'>ANULEAZĂ</Button>
                    <Button onClick={() => deleteTreatmentPlan()} sx={{color: '#F52A2A'}}>ȘTERGE</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default TreatmentCard;