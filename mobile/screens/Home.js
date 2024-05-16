import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import BottomBar from '../components/BottomBar';
//import image from './image.jpg';

export default function Home()
{
    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greetingText}>Salut,</Text>
                    <Text style={styles.greetingText}>User!</Text>
                </View>
                <View style={styles.profileButton}>
                    {/* <Image source={image} style={styles.profileIcon}/> */}
                </View>
            </View>
            <View style={styles.content}></View>
            <BottomBar/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 35,
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
        fontSize: 22,
        fontWeight: 'bold',
        color: '#6961A8'
    },
    profileButton: {
        width: 50,
        height: 50,
        borderRadius: 50
    },
    profileIcon: {
        width: 50,
        height: 50,
        borderRadius: 50
    },
    content: {
        flex: 1
    }
});