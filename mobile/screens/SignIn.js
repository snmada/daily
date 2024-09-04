import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {Text, View, TextInput, TouchableOpacity, Alert} from 'react-native';
import * as yup from 'yup';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEye, faEyeSlash, faUser, faLock} from '@fortawesome/free-solid-svg-icons';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignIn()
{
    const navigation = useNavigation();

    const [showPassword, setShowPassword] = useState(true);
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const schema = yup.object().shape({
        username: yup.string().required('Câmp obligatoriu'),
        password: yup.string().required('Câmp obligatoriu')
    });

    const {control, handleSubmit, formState: {errors}} = useForm({
        resolver: yupResolver(schema),
        defaultValues: {username: '', password: ''}
    });

    const onSubmit = (data) => {
        axios.post(`http://${process.env.IP_ADDRESS}:8082/signin/user-sign-in`, {
            username: data.username,
            password: data.password
        })
        .then((response) => {
            if(response.status === 200)
            {
                AsyncStorage.setItem('uuid_doctor', response.data.uuid_doctor);
                AsyncStorage.setItem('uuid_patient', response.data.uuid_patient);
                navigation.navigate('Home');
            }
        })
        .catch((error) => {
            (error.response.status === 404 || error.response.status === 422)? 
                Alert.alert(error.response.data) : Alert.alert('A intervenit o eroare. Vă rugăm să încercați mai târziu.');
        });
    };

    return(
        <View style={styles.viewSignIn}>
            <Text style={styles.logo}>DAILY</Text>
            <View style={styles.viewForm}>
                <Controller
                    control={control}
                    render={({field: {onChange, value}}) => (
                        <View style={styles.viewTextInput}>
                            <FontAwesomeIcon icon={faUser} style={styles.icon} size={15}/>
                            <TextInput
                                style={styles.textInput}
                                placeholder='Nume utilizator'
                                onChangeText={onChange}
                                value={value}
                            />
                        </View>
                    )}
                    name='username'
                />
                {errors.username && <Text style={styles.error}>{errors.username.message}</Text>}
                <Controller
                    control={control}
                    render={({field: {onChange, value}}) => (
                        <View style={styles.viewTextInput}>
                            <FontAwesomeIcon icon={faLock} style={styles.icon} size={15}/>
                            <TextInput
                                style={styles.textInput}
                                placeholder='Parolă'
                                onChangeText={onChange}
                                value={value}
                                secureTextEntry={showPassword}
                            />
                            <TouchableOpacity onPress={handleClickShowPassword} style={{padding: 10}}>
                                <FontAwesomeIcon icon={showPassword? faEye : faEyeSlash} style={styles.icon} size={19}/>
                            </TouchableOpacity>
                        </View>
                    )}
                    name='password'
                />
                {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
                <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                    <Text>Nu-mi amintesc parola</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonSignIn} onPress={handleSubmit(onSubmit)}>
                    <Text style={styles.textButtonSignIn}>Intră în cont</Text>
                </TouchableOpacity>
                <View style={styles.viewOR}>
                    <View style={styles.line}/>
                        <Text style={styles.textOR}>SAU</Text>
                    <View style={styles.line}/>
                </View>
                <TouchableOpacity style={styles.buttonSignUp} onPress={() => navigation.navigate('SignUp')}>
                    <Text style={styles.textButtonSignUp}>Înregistrează-te</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    logo: {
        fontSize: 30,
        paddingVertical: 30
    },
    viewSignIn: {
        backgroundColor: '#FBFBFB',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    viewForm: {
        gap: 10,
        width: 300
    },
    viewTextInput: {
        flexDirection: 'row', 
        alignItems: 'center', 
        borderRadius: 7, 
        borderWidth: 1,
        borderColor: '#DBDFEA',
        paddingLeft: 10
    },
    textInput: {
        borderRadius: 7,
        paddingHorizontal: 10,
        paddingVertical: 10,
        fontSize: 16,
        flex: 1, 
        padding: 10,
        fontSize: 16
    },
    buttonSignIn: {
        marginTop: 5,
        height: 50,
        width: 300,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#6961A8',
        borderRadius: 50
    },
    textButtonSignIn: {
        fontSize: 18,
        color: '#FBFBFB',
        fontWeight: 'bold'
    },
    buttonSignUp: {
        marginTop: 5,
        height: 50,
        width: 300,
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: '#BFDCE5',
        borderRadius: 50,
        borderColor: '#6961A8',
        borderWidth: 2
    },
    textButtonSignUp: {
        fontSize: 18,
        color: '#6961A8',
        fontWeight: 'bold'
    },
    error: {
        color: '#f52a2a'
    },
    icon: {
        color: '#9DB2BF'
    },
    viewOR: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#9DB2BF',
        marginHorizontal: 5
    },
    textOR: {
        fontSize: 16,
        fontWeight: 'bold',
        marginHorizontal: 10,
        color: '#9DB2BF'
    }
});