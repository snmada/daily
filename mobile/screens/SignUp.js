import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {Text, View, TextInput, TouchableOpacity, Alert} from 'react-native';
import * as yup from 'yup';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEye, faEyeSlash, faUser, faLock, faAddressCard, faStarOfLife} from '@fortawesome/free-solid-svg-icons';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignUp()
{
    const navigation = useNavigation();
    
    const [showPassword, setShowPassword] = useState(true);
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const [showConfirmPassword, setShowConfirmPassword] = useState(true);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

    const schema = yup.object().shape({
        accessCode: yup.string().required('Câmp obligatoriu'),
        CNP: yup.string().required('Câmp obligatoriu').min(13, 'CNP invalid').max(13, 'CNP invalid'),
        username: yup.string().required('Câmp obligatoriu').matches(/[a-zA-Z]+$/, 'Sunt acceptate doar caractere alfabetice'),
        password: yup.string().required('Câmp obligatoriu').min(8, 'Lungimea minimă este de 8 caractere').max(15, 'Lungimea maximă este de 15 caractere'),
        confirmPassword: yup.string().required('Câmp obligatoriu').oneOf([yup.ref('password'), null], 'Parolele introduse nu coincid')
    });

    const {control, handleSubmit, formState: {errors}} = useForm({
        resolver: yupResolver(schema),
        defaultValues: {accessCode: '', CNP: '', username: '', password: '', confirmPassword: ''}
    });

    const onSubmit = (data) => {
        axios.post(`http://${process.env.IP_ADDRESS}:8082/signup/user-sign-up`, {
            accessCode: data.accessCode,
            CNP: data.CNP,
            username: data.username,
            password: data.password
        })
        .then((response) => {
            if(response.status === 200)
            {
                // AsyncStorage.setItem('uuid_doctor', response.data.uuid_doctor);
                AsyncStorage.setItem('uuid_patient', response.data.uuid_patient);
                navigation.navigate('Home');
            }
        })
        .catch((error) => {
            (error.response.status === 404 || error.response.status === 409)?
                Alert.alert(error.response.data) : Alert.alert('A intervenit o eroare. Vă rugăm să încercați mai târziu.');
        });
    };

    return(
        <View style={styles.viewSignUp}>
            <Text style={styles.logo}>DAILY</Text>
            <View style={styles.viewForm}>
                <Controller
                    control={control}
                    render={({field: {onChange, value}}) => (
                        <View style={styles.viewTextInput}>
                            <FontAwesomeIcon icon={faStarOfLife} style={styles.icon} size={15}/>
                            <TextInput 
                                style={styles.textInput}
                                placeholder='Cod pacient'
                                onChangeText={onChange}
                                value={value}
                            /> 
                        </View>
                    )}
                    name='accessCode'
                />
                {errors.accessCode && <Text style={styles.error}>{errors.accessCode.message}</Text>}
                <Controller
                    control={control}
                    render={({field: {onChange, value}}) => (
                        <View style={styles.viewTextInput}>
                            <FontAwesomeIcon icon={faAddressCard} style={styles.icon} size={15}/>
                            <TextInput
                                style={styles.textInput}
                                placeholder='CNP (Cod Numeric Personal)'
                                onChangeText={onChange}
                                value={value}
                            />
                        </View>
                    )}
                    name='CNP'
                />
                {errors.CNP && <Text style={styles.error}>{errors.CNP.message}</Text>}
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
                <Controller
                    control={control}
                    render={({field: {onChange, value}}) => (
                        <View style={styles.viewTextInput}>
                            <FontAwesomeIcon icon={faLock} style={styles.icon}/>
                            <TextInput
                                style={styles.textInput}
                                placeholder='Confirmare parolă'
                                onChangeText={onChange}
                                value={value}
                                secureTextEntry={showConfirmPassword}
                            />
                            <TouchableOpacity onPress={handleClickShowConfirmPassword} style={{padding: 10}}>
                                <FontAwesomeIcon icon={showConfirmPassword? faEye : faEyeSlash} style={styles.icon} size={19}/>
                            </TouchableOpacity>
                        </View>
                    )}
                    name='confirmPassword'
                />
                {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword.message}</Text>}
                <TouchableOpacity style={styles.buttonSignUp} onPress={handleSubmit(onSubmit)}>
                    <Text style={styles.textButtonSignUp}>Înregistrează-te</Text>
                </TouchableOpacity>
                <View style={styles.viewOR}>
                    <View style={styles.line}/>
                        <Text style={styles.textOR}>SAU</Text>
                    <View style={styles.line}/>
                </View>
                <TouchableOpacity style={styles.buttonSignIn} onPress={() => navigation.navigate('SignIn')}>
                    <Text style={styles.textButtonSignIn}>Intră în cont</Text>
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
    viewSignUp: {
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
        borderRadius: 10, 
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
    buttonSignUp: {
        marginTop: 5,
        height: 50,
        width: 300,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#6961A8',
        borderRadius: 50
    },
    textButtonSignUp: {
        fontSize: 18,
        color: '#FBFBFB',
        fontWeight: 'bold'
    },
    buttonSignIn: {
        marginTop: 5,
        height: 50,
        width: 300,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        borderColor: '#6961A8',
        borderWidth: 2
    },
    textButtonSignIn: {
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