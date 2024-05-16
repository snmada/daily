import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Image, ScrollView} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPlus, faTrash} from '@fortawesome/free-solid-svg-icons'; 
import * as ImagePicker from 'expo-image-picker';
import {ref, uploadBytes} from 'firebase/storage';
import storage from '../config/config.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomBar from '../components/BottomBar.js';

export default function UploadImage()
{
    const [uuidPatient, setUuidPatient] = useState('');
    const [uuidDoctor, setUuidDoctor] = useState('');
    const [images, setImages] = useState(Array(3).fill(null));

    useEffect(() => {
        const retrieveData = async () => {
            try{
                const uuid_patient = await AsyncStorage.getItem('uuid_patient');
                const uuid_doctor = await AsyncStorage.getItem('uuid_doctor');

                if(uuid_patient !== null && uuid_doctor !== null) 
                {
                    setUuidPatient(uuid_patient);
                    setUuidDoctor(uuid_doctor);
                }
            }
            catch(error){
                console.error('Error retrieving data from AsyncStorage:', error);
            }
        };
        retrieveData();
    }, []); 

    const pickImage = async (index) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
    
        if (!result.canceled) 
        {
            const imageUri = result.assets[0].uri;
            const newImages = [...images];
            newImages[index] = {uri: imageUri};
            setImages(newImages);
        }
    };

    const removeImage = (index) => {
        const newImages = [...images];
        newImages[index] = null;
        setImages(newImages);
    };

    const formatDate = (date) => {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const formattedDay = day < 10 ? '0' + day : day;
        const formattedMonth = month < 10 ? '0' + month : month;
        return formattedDay + '-' + formattedMonth + '-' + date.getFullYear();
    };

    const handleUpload = async () => {
        try{
            const uploadTasks = images.map(async (image, index) => {
                if(image && image.uri)
                {
                    const currentDate = new Date();
                    const formattedDate = formatDate(currentDate);
                    const storageRef = ref(storage, `${uuidDoctor}/${uuidPatient}/${formattedDate}/image-${index + 1}`);
                    const response = await fetch(image.uri);
                    const blobFile = await response.blob();
                    await uploadBytes(storageRef, blobFile);
                }
            });
            await Promise.all(uploadTasks);
        } 
        catch(error){
            console.error(error);
        }
    };
    
    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Adaugă trei imagini</Text>
                    </View>
                    <View style={styles.imagesContainer}>
                        {images.map((image, index) => (
                            <TouchableOpacity key={index} onPress={() => pickImage(index)} style={styles.imageContainer}>
                                {
                                    image? 
                                    (
                                        <>
                                            <Image source={{uri: image.uri}} style={styles.image}/>
                                            <TouchableOpacity onPress={() => removeImage(index)} style={styles.removeButton}>
                                                <FontAwesomeIcon icon={faTrash} size={20} style={styles.removeIcon}/>
                                            </TouchableOpacity>
                                        </>
                                    ) 
                                    : 
                                    (
                                        <View style={styles.addView}>
                                            {index === 0 && (
                                                <>
                                                    <FontAwesomeIcon icon={faPlus} size={30} style={styles.addIcon}/>
                                                    <Text style={styles.direction}>Frontal</Text>
                                                </>
                                            )}
                                            {index === 1 && (
                                                <>
                                                    <FontAwesomeIcon icon={faPlus} size={30} style={styles.addIcon}/>
                                                    <Text style={styles.direction}>Lateral Stânga</Text>
                                                </>
                                            )}
                                            {index === 2 && (
                                                <>
                                                    <FontAwesomeIcon icon={faPlus} size={30} style={styles.addIcon}/>
                                                    <Text style={styles.direction}>Lateral Dreapta</Text>
                                                </>
                                            )}
                                        </View>
                                    )
                                }
                            </TouchableOpacity>
                        ))}
                    </View>
                    {images.every(image => image !== null) && (
                        <TouchableOpacity onPress={handleUpload} style={styles.button}>
                            <Text style={styles.buttonText}>SALVEAZĂ</Text>
                        </TouchableOpacity>
                    )} 
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
        paddingBottom: 15
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        marginBottom: 20
    },
    title:{
        fontSize: 22
    },
    imagesContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 0,
        marginBottom: 20,
        backgroundColor: '#F3F8FF',
        padding: 20,
        borderRadius: 10
    },
    imageContainer: {
        width: 300,
        height: 300,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 5, 
        borderColor: '#E9E8E8',  
        borderStyle: 'dashed' 
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },
    addIcon: {
        color: '#C7C8CC'
    },
    removeButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: 15,
        padding: 5
    },
    removeIcon: {
        color: '#f52a2a'
    },
    button: {
        width: '100%',
        paddingVertical: 10, 
        backgroundColor: '#6961A8', 
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderRadius: 10
    },
    buttonText: {
        fontSize: 16,
        color: '#FBFBFB', 
        textAlign: 'center',
        justifyContent: 'center'
    },
    addView:{
        justifyContent: 'center',
        alignItems: 'center'
    },
    direction: {
        fontSize: 17,
        marginTop: 5,
        color: '#607274'
    }
});
