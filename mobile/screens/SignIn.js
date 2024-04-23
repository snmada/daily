import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {Text, View, TextInput, TouchableOpacity, Alert} from 'react-native';
import * as yup from 'yup';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';
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
                AsyncStorage.setItem('uuid_patient', response.data);
            }
        })
        .catch((error) => {
            (error.response.status === 404 || error.response.status === 422)? 
                Alert.alert(error.response.data) : Alert.alert('A intervenit o eroare. Vă rugăm să încercați mai târziu.');
        });
    };

    return(
        <View style={styles.viewSignIn}>
            <View style={styles.viewForm}>
                <Controller
                    control={control}
                    render={({field: {onChange, value}}) => (
                        <TextInput
                            style={styles.textInput}
                            placeholder='Nume utilizator'
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                    name='username'
                />
                {errors.username && <Text style={styles.error}>{errors.username.message}</Text>}
                <Controller
                    control={control}
                    render={({field: {onChange, value}}) => (
                        <View style={styles.viewPassword}>
                            <TextInput
                                style={styles.inputPassword}
                                placeholder='Parolă'
                                onChangeText={onChange}
                                value={value}
                                secureTextEntry={showPassword}
                            />
                            <TouchableOpacity onPress={handleClickShowPassword} style={{padding: 10}}>
                                <FontAwesomeIcon icon={showPassword? faEye : faEyeSlash}/>
                            </TouchableOpacity>
                        </View>
                    )}
                    name='password'
                />
                {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
                <View style={styles.viewSignUpLink}>
                    <Text>Nu aveți un cont creat? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                        <Text>Creează acum</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
                    <Text style={styles.textButton}>Intră în cont</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    textTitle: {
        fontSize: 18,
        paddingVertical: 30
    },
    viewSignIn: {
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    viewForm: {
        gap: 15,
        width: 300,
    },
    textInput: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 7,
        paddingHorizontal: 10,
        paddingVertical: 10,
        fontSize: 16
    },
    button: {
        marginTop: 5,
        height: 45,
        width: 300,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#8BF5FA'
    },
    textButton: {
        fontSize: 16
    },
    error: {
        color: '#f52a2a',
        padding: 1
    },
    viewPassword: {
        flexDirection: 'row', 
        alignItems: 'center', 
        borderRadius: 7, 
        borderWidth: 1,
        borderColor: 'gray'
    },
    inputPassword: {
        flex: 1, 
        padding: 10,
        fontSize: 16
    },
    viewSignUpLink: {
        flexDirection: 'row', 
    }
});