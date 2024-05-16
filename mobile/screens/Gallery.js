import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, TouchableOpacity, Modal} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import BottomBar from '../components/BottomBar.js';
import {ref, listAll, getDownloadURL} from 'firebase/storage';
import storage from '../config/config.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faX, faPlus, faCameraRetro, faCalendarDays} from '@fortawesome/free-solid-svg-icons'; 

export default function Gallery() 
{
    const navigation = useNavigation();
    const [fullScreenImage, setFullScreenImage] = useState(null);
    const openFullScreen = (image) => setFullScreenImage(image);
    const closeFullScreen = () => setFullScreenImage(null);
    const [folderData, setFolderData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const fetchData = async () => {
            try{
                const uuid_patient = await AsyncStorage.getItem('uuid_patient');
                const uuid_doctor = await AsyncStorage.getItem('uuid_doctor');

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
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Galerie</Text>
                        <TouchableOpacity style={styles.uploadButton} onPress={() => navigation.navigate('UploadImage')}>
                            <FontAwesomeIcon icon={faPlus} style={styles.plusIcon} size={16}/>
                            <FontAwesomeIcon icon={faCameraRetro} style={styles.cameraIcon} size={20}/>
                        </TouchableOpacity>
                    </View>
                    {
                        !isLoading?
                        (

                            folderData.length === 0?
                            (
                                <Text style={styles.noData}>Nu există imagini încărcate...</Text>
                            )
                            :
                            (
                                <>
                                {folderData.map((folder, index) => (
                                    <View key={index} style={styles.folderContainer}>
                                        <View style={styles.folderHeader}>
                                            <View style={styles.date}>
                                                <FontAwesomeIcon icon={faCalendarDays} style={styles.iconCalendar} size={20}/>
                                                <Text style={styles.textFolder}>{folder.folderName}</Text>
                                            </View>
                                        </View>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                            {folder.images.map((image, imageIndex) => (
                                                <TouchableOpacity key={imageIndex} onPress={() => openFullScreen(image)}>
                                                    <Image
                                                        style={styles.carouselImage}
                                                        source={{uri: image}}
                                                    />
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    </View>
                                ))}
                                <Modal visible={fullScreenImage !== null} transparent={true} onRequestClose={closeFullScreen}>
                                    <View style={styles.modalContainer}>
                                        <TouchableOpacity style={styles.closeButton} onPress={closeFullScreen}>
                                            <FontAwesomeIcon icon={faX} size={15} style={styles.icon}/>
                                        </TouchableOpacity>
                                        <Image
                                            style={styles.fullScreenImage}
                                            source={{uri: fullScreenImage}}
                                        />
                                    </View>
                                </Modal>
                                </>
                            )
                        )
                        :
                        (
                            <View style={styles.centeredContent}>
                                <ActivityIndicator size='large' color='#6961A8'/>
                            </View>
                        )
                    }
                </View>
            </ScrollView>
            <BottomBar/>
        </View>   
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 10,
        top: 60,
        flex: 1,
        backgroundColor: '#FBFBFB',
        paddingLeft: 20,
        paddingRight: 20
    },
    scrollView: {
        flex: 1,
        marginBottom: 0 
    },
    content: {
        flexGrow: 1,
        paddingTop: 25,
        paddingBottom: 25
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#6961A8'
    },
    title:{
        fontSize: 24,
        paddingLeft: 10
    },
    uploadButton: {
        backgroundColor: '#6961A8',
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10
    },
    plusIcon: {
        marginRight: 5,
        color: '#FBFBFB'
    },
    cameraIcon: {
        color: '#FBFBFB'
    },
    folderContainer: {
        paddingTop: 20,
        paddingLeft: 20,
        paddingBottom: 20,
        marginBottom: 10,
        marginTop: 10,
        backgroundColor: '#F3F8FF',
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10
    },
    folderHeader: {
        marginBottom: 15,
        flexDirection: 'row',
        height: 'max-content',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 9999
    },
    date: {
        flexDirection: 'row',
    },
    iconCalendar: {
        color: '#6961A8',
        marginRight: 10
    },
    textFolder: {
        fontSize: 16
    },
    carouselImage: {
        width: 200, 
        height: 200, 
        marginRight: 10, 
        borderRadius: 10
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        padding: 10,
        backgroundColor: '#191919',
        borderRadius: 5
    },
    fullScreenImage: {
        width: '90%',
        height: '90%',
        resizeMode: 'contain'
    },
    centeredContent: {
        height: 500,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center'
    },
    noData: {
        marginTop: 20,
        fontSize: 18
    }
});