import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native';
import BottomBar from '../components/BottomBar.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {faSun, faMoon, faExplosion} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

export default function Treatment()
{
    const [treatmentPlan, setTreatmentPlan] = useState([]);

    useEffect(() => {
        const fetchTreatmentPlan = async () => {
            const uuid_patient = await AsyncStorage.getItem('uuid_patient');

            if(uuid_patient !== null) 
            {
                axios.get(`http://${process.env.IP_ADDRESS}:8082/treatment/treatment-plan/${uuid_patient}`)
                .then((response) => {
                    if(response.status === 200)
                    {
                        setTreatmentPlan(response.data);
                    }
                })
                .catch((error) => {
                    Alert.alert('A intervenit o eroare. Vă rugăm să încercați mai târziu.');
                });
            } 
        }
        fetchTreatmentPlan(); 
    }, []); 

    return(
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Schema de tratament</Text>
                    </View>
                    {
                        treatmentPlan.length == 0?
                        (
                            <Text style={styles.noData}>Nu există niciun tratament adăugat...</Text>
                        )
                        :
                        (
                            treatmentPlan.map((treatment, index) => (
                                <View style={styles.treatmentContainer} key={index}>
                                    <Text style={styles.recommendation}>{treatment.recommendation}</Text>
                                    <View style={styles.row}>
                                        <View style={[styles.cell, styles.firstColumn]}>
                                            <View style={[styles.viewIcon, {backgroundColor: '#FFF9B6'}]}>
                                                <FontAwesomeIcon icon={faExplosion} size={25} style={{color: '#FF865E'}}/>
                                            </View>
                                        </View>
                                        <View style={[styles.cell, styles.secondColumn]}>
                                            <Text style={styles.cellText}>{treatment.morning}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.row}>
                                        <View style={[styles.cell, styles.firstColumn]}>
                                            <View style={[styles.viewIcon, {backgroundColor: '#e7feff'}]}>
                                                <FontAwesomeIcon icon={faSun} size={25} style={{color: '#FFBD35'}}/>
                                            </View>
                                        </View>
                                        <View style={[styles.cell, styles.secondColumn]}>
                                            <Text style={styles.cellText}>{treatment.noon}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.row}>
                                        <View style={[styles.cell, styles.firstColumn]}>
                                            <View style={[styles.viewIcon, {backgroundColor: '#2C4E80'}]}>
                                                <FontAwesomeIcon icon={faMoon} size={20} style={{color: '#FBFBFB'}}/>
                                            </View>
                                        </View>
                                        <View style={[styles.cell, styles.secondColumn]}>
                                            <Text style={styles.cellText}>{treatment.evening}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.row}>
                                        <View style={[styles.cell, styles.firstColumn]}>
                                            <View style={[styles.viewIcon, {elevation: 0}]}>
                                                <Text style={styles.observation}>Obs.</Text>
                                            </View>
                                        </View>
                                        <View style={[styles.cell, styles.secondColumn]}>
                                            <Text style={styles.cellText}>{treatment.observations}</Text>
                                        </View>
                                    </View>
                                </View>
                            ))
                        )
                    }
                </View>
            </ScrollView>
            <BottomBar/>
        </View>
    )
}

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
        flex: 1
    },
    content: {
        flexGrow: 1,
        paddingTop: 25,
        paddingBottom: 25
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#6961A8'
    },
    title: {
        fontSize: 24,
        paddingLeft: 10
    },
    treatmentContainer: {
        backgroundColor: '#FBFBFB',
        padding: 20,
        borderRadius: 15,
        marginBottom: 20,
        marginLeft: 10,
        marginRight: 10,
        elevation: 5
    },
    recommendation: {
        fontSize: 18,
        paddingTop: 10,
        paddingBottom: 20,
        textAlign: 'center'
    },
    row: {
        flexDirection: 'row',
        marginBottom: 10
    },
    cell: {
        padding: 5
    },
    firstColumn: {
        flex: 1
    },
    secondColumn: {
        flex: 4, 
        paddingLeft: 20,
        justifyContent: 'center'
    },
    viewIcon: {
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 15,
        paddingBottom: 15,
        borderRadius: 10,
        elevation: 5
    },
    observation: {
        fontWeight: 'bold'
    },
    cellText: {
        fontSize: 16
    },
    noData: {
        marginTop: 20,
        fontSize: 18
    }
});