import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {Text, View, TextInput, TouchableOpacity} from 'react-native';
import * as yup from 'yup';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';

export default function SignUp()
{
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

    const onSubmit = (data) => console.log(data);

    return(
        <View style={styles.viewSignUp}>
            <Text style={styles.textTitle}>Înregistrare pacient</Text>
            <View style={styles.viewForm}>
                <Controller
                    control={control}
                    render={({field: {onChange, value}}) => (
                        <TextInput 
                            style={styles.textInput}
                            placeholder='Cod de acces'
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                    name='accessCode'
                />
                {errors.accessCode && <Text style={styles.error}>{errors.accessCode.message}</Text>}
                <Controller
                    control={control}
                    render={({field: {onChange, value}}) => (
                        <TextInput
                            style={styles.textInput}
                            placeholder='CNP (Cod Numeric Personal)'
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                    name='CNP'
                />
                {errors.CNP && <Text style={styles.error}>{errors.CNP.message}</Text>}
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
                <Controller
                    control={control}
                    render={({field: {onChange, value}}) => (
                        <View style={styles.viewPassword}>
                            <TextInput
                                style={styles.inputPassword}
                                placeholder='Confirmare parolă'
                                onChangeText={onChange}
                                value={value}
                                secureTextEntry={showPassword}
                            />
                            <TouchableOpacity onPress={handleClickShowConfirmPassword} style={{padding: 10}}>
                                <FontAwesomeIcon icon={showConfirmPassword? faEye : faEyeSlash} />
                            </TouchableOpacity>
                        </View>
                    )}
                    name='confirmPassword'
                />
                {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword.message}</Text>}
                <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
                    <Text style={styles.textButton}>Înregistrare</Text>
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
    viewSignUp: {
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
    }
});