import React, {useState, useEffect} from 'react';
import './Gallery.scss';
import {Grid, Typography, Box, IconButton, Skeleton} from '@mui/material';
import {ref, listAll, getDownloadURL} from 'firebase/storage';
import {jwtDecode} from 'jwt-decode';
import {useParams} from 'react-router-dom';
import storage from '../../config/config';
import {Close as CloseIcon, ZoomIn as ZoomInIcon, ZoomOut as ZoomOutIcon, Photo as PhotoIcon} from '@mui/icons-material';

export default function Gallery() 
{
    const param = useParams();
    const decoded_token = jwtDecode(sessionStorage.getItem('token'));
    const [folderData, setFolderData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedFolderImages, setSelectedFolderImages] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);

    const closeModal = () => setIsModalOpen(false);
    
    const handleFolderClick = (images) => {
        setSelectedFolderImages(images);
        setIsModalOpen(true);
    };

    const handleImageClick = (index) => setSelectedImageIndex(index);

    useEffect(() => {
        const fetchData = async () => {
            try{
                const uuid_patient = param.uuid_patient;
                const uuid_doctor = decoded_token.uuid_doctor;

                if(uuid_patient !== null && uuid_doctor !== null) 
                {
                    const parentRef = ref(storage, `${uuid_doctor}/${uuid_patient}`);
                    const fetchedFolderData = [];
                    const res = await listAll(parentRef);

                    for(let i = 0; i < res.prefixes.length; i++)
                    {
                        const folderRef = res.prefixes[i];
                        const folderName = folderRef.name;
                        const folderStorageRef = ref(storage, `${uuid_doctor}/${uuid_patient}/${folderName}`);
                        const folderRes = await listAll(folderStorageRef);
                        const imageURLs = [];

                        for(let j = 0; j < folderRes.items.length; j++)
                        {
                            const imageRef = folderRes.items[j];
                            const imageURL = await getDownloadURL(imageRef);
                            imageURLs.push(imageURL);
                        }

                        fetchedFolderData.push({folderName, images: imageURLs});
                    }
                    setFolderData(fetchedFolderData);
                    setIsLoading(false);
                } 
            }
            catch(error){
                console.error(error);
            }
        };
        fetchData(); 
    }, []); 

    return (
        <Grid container className='container-gallery'>
            <Grid item xs={12}>
                <Typography className='title'>Galerie</Typography>
                <Box className='folder-box'>
                    {
                        !isLoading?
                        (
                            folderData.length !== 0? 
                            (
                                folderData.map((folder, index) => (
                                    <Box key={index} className='folder-item' onClick={() => handleFolderClick(folder.images)}>
                                        <IconButton><PhotoIcon/></IconButton> 
                                        <Box flexGrow={1}>{folder.folderName}</Box>
                                    </Box>
                                ))
                            ) 
                            : 
                            (
                                <Box className='no-data-box'>
                                    <Typography sx={{color: '#61677A'}} pb={2}>Nu există imagini încărcate</Typography>
                                </Box>
                            )
                        )
                        :
                        (
                            <>
                                <Skeleton animation='wave'/>
                                <Skeleton width={250}/>
                            </>
                        )
                    }
                </Box>

                {isModalOpen && (
                    <div className='modal'>
                        {
                            selectedImageIndex === null?
                            (
                                <div>
                                    <Box className='box-close' pb={2}>
                                        <IconButton onClick={closeModal} className='close-icon'>
                                            <CloseIcon/>
                                        </IconButton>
                                    </Box>
                                    <Box className='modal-content'>
                                        {
                                            selectedFolderImages.map((image, index) => (
                                                <div key={index} className='image-container' onClick={() => handleImageClick(index)}>
                                                    <div className='zoomIn-div'>
                                                        <IconButton><ZoomInIcon sx={{fontSize: '2rem'}}/></IconButton>
                                                    </div>
                                                    <img
                                                        className='image'
                                                        src={image}
                                                        alt={`Image ${index}`}
                                                    />
                                                </div>
                                            ))
                                        }
                                    </Box>
                                </div>
                            ) 
                            : 
                            (
                                <div className='selected-image-container'>
                                    <div className='zoomOut-div'>
                                        <IconButton onClick={() => setSelectedImageIndex(null)}><ZoomOutIcon sx={{fontSize: '2rem'}}/></IconButton>
                                    </div>
                                    <img
                                        className='selected-image'
                                        src={selectedFolderImages[selectedImageIndex]}
                                        alt={`Image ${selectedImageIndex}`}
                                        onClick={() => setSelectedImageIndex(null)}
                                    />
                                </div>
                            )
                        }
                    </div>
                )}
            </Grid>
        </Grid>
    );
}