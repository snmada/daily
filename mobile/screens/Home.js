import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ImageBackground, Alert, TouchableWithoutFeedback, Modal, TouchableOpacity} from 'react-native';
import BottomBar from '../components/BottomBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faGear, faPills, faImages, faListCheck, faX} from '@fortawesome/free-solid-svg-icons';
import firstBoxImage from '../images/firstBox.png';
import secondBoxImage from '../images/secondBox.png';
import thirdBoxImage from '../images/thirdBox.png';
import fourthBoxImage from '../images/fourthBox.png';
import {useNavigation} from '@react-navigation/native';

export default function Home()
{
    const [user, setUser] = useState({});
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [recommendation, setRecommendation] = useState('');
    const [uuidPatient, setUuidPatient] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try{
                const uuid_patient = await AsyncStorage.getItem('uuid_patient');

                if(uuid_patient !== null) 
                {
                    setUuidPatient(uuid_patient);
                    axios.get(`http://${process.env.IP_ADDRESS}:8082/home/user-data/${uuid_patient}`)
                    .then((response) => {
                        if(response.status === 200)
                        {
                            setUser(response.data);
                        }
                    })
                    .catch((error) => {
                        Alert.alert('A intervenit o eroare. Vă rugăm să încercați mai târziu.');
                    });            
                }
            }
            catch(error){
                console.error('Error retrieving data from AsyncStorage:', error);
            }
        };
        fetchUserData();
    }, []);

    const fetchRecommendation = () => {
        axios.get(`http://${process.env.IP_ADDRESS}:8082/home/recommendation/${uuidPatient}`)
        .then((response) => {
            if(response.status === 200)
            {
                setModalVisible(true);
                setRecommendation(response.data);
            }
        })
        .catch((error) => {
            Alert.alert('A intervenit o eroare. Vă rugăm să încercați mai târziu.');
        });     
    }

    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greetingText}>Salut,</Text>
                    <Text style={styles.greetingText}>{user.firstname} {user.lastname}! 👋🏼</Text>
                </View>
            </View>
            <View style={styles.content}>
                <View style={styles.box}>
                    <TouchableWithoutFeedback onPress={() => navigation.navigate('Treatment')}>
                        <ImageBackground source={firstBoxImage} style={styles.imageBackground}>
                            <Text style={styles.textBox}>Schema de tratament</Text>
                            <View style={styles.boxIcon}>
                                <FontAwesomeIcon icon={faPills} style={{color: '#5b7c86'}} size={26}/>
                            </View>
                        </ImageBackground>
                    </TouchableWithoutFeedback>
                </View>
                <View style={styles.box}>
                    <TouchableWithoutFeedback onPress={() => navigation.navigate('Gallery')}>
                        <ImageBackground source={secondBoxImage} style={styles.imageBackground}>
                            <Text style={styles.textBox}>Galerie</Text>
                            <View style={styles.boxIcon}>
                                <FontAwesomeIcon icon={faImages} style={{color: '#6961A8'}} size={26}/>
                            </View>
                        </ImageBackground>
                    </TouchableWithoutFeedback>
                </View>
                <View style={styles.box}>
                    <TouchableWithoutFeedback onPress={() => fetchRecommendation()}>
                        <ImageBackground source={thirdBoxImage} style={styles.imageBackground}>
                            <Text style={styles.textBox}>Recomandările medicului</Text>
                            <View style={styles.boxIcon}>
                                <FontAwesomeIcon icon= {faListCheck} style={{color: '#e4910b'}} size={26}/>
                            </View>
                        </ImageBackground>
                    </TouchableWithoutFeedback>
                </View>
                <View style={styles.box}>
                    <TouchableWithoutFeedback onPress={() => navigation.navigate('Settings')}>
                        <ImageBackground source={fourthBoxImage} style={styles.imageBackground}>
                            <Text style={styles.textBox}>Setări</Text>
                            <View style={styles.boxIcon}>
                                <FontAwesomeIcon icon={faGear} style={{color: '#57575b'}} size={26}/>
                            </View>
                        </ImageBackground>
                    </TouchableWithoutFeedback>
                </View> 
            </View>
            <BottomBar/>
            <Modal animationType='slide' transparent={true} visible={modalVisible} onRequestClose={() => {setModalVisible(!modalVisible)}}>
                <View style={styles.centeredView}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(!modalVisible)}>
                        <FontAwesomeIcon icon={faX} size={15} style={{color: '#FBFBFB'}}/>
                    </TouchableOpacity>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Recomandări</Text>
                        <Text style={styles.modalText}>{recommendation}</Text>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 65,
        top: 60,
        flex: 1,
        backgroundColor: '#FBFBFB',
        paddingLeft: 20,
        paddingRight: 20
    },
    header: {
        flexDirection: 'row',
        height: 'max-content',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    greetingText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#6961A8'
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 40
    },
    box: {
        width: '47%', 
        height: 190,
        marginBottom: 35, 
        borderRadius: 30,
        overflow: 'hidden'
    },
    imageBackground:{
        width: '100%',
        height: 190,
        borderRadius: 30
    },
    textBox: {
        position: 'absolute',
        top: 20,
        left: 20,
        fontSize: 19,
        fontWeight: 'bold'
    },
    boxIcon: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        padding: 12,
        backgroundColor: '#EEEEEE',
        borderRadius: 10,
        elevation: 4
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        padding: 10,
        backgroundColor: '#191919',
        borderRadius: 5
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center'
    },
    modalTitle: {
        marginBottom: 35,
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold'
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 18
    }
});