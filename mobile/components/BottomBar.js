import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faHouseChimneyUser, faNewspaper, faImage} from '@fortawesome/free-solid-svg-icons'; 
import {useNavigation} from '@react-navigation/native';

export default function BottomBar()
{
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.navigate('Gallery')} style={styles.button}>
                <FontAwesomeIcon icon={faNewspaper} size={20} style={styles.icon}/>
                <Text style={styles.buttonText}>Tratament</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.buttonHome}>
                <FontAwesomeIcon icon={faHouseChimneyUser} size={25} style={styles.iconHome}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Gallery')} style={styles.button}>
                <FontAwesomeIcon icon={faImage} size={20} style={styles.icon}/>
                <Text style={styles.buttonText}>Galerie</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#6961A8',
        height: 65,
        marginBottom: 110,
        borderRadius: 10
    },
    buttonHome: {
        backgroundColor: '#BFDCE5',
        height: 80,
        width: 80,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        marginBottom: 40,
        borderWidth: 6, 
        borderColor: '#FBFBFB'
    },
    button: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: 17,
        color: '#FBFBFB',
        fontWeight: 'bold'
    },
    iconHome: {
        color: '#6961a8'
    },
    icon: {
        color: '#FBFBFB'
    }
});