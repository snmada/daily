import React, {useState} from 'react';
import {View, Text, StyleSheet, Alert, TouchableOpacity, TextInput} from 'react-native';
import axios from 'axios';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCircleRight, faLock, faEye, faReply, faCheckCircle, faEyeSlash, faPaperPlane, faAt, faShieldHalved} from '@fortawesome/free-solid-svg-icons';
import {useNavigation} from '@react-navigation/native';
import {Controller, useForm} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';

export default function ResetPassword()
{
    const navigation = useNavigation();
    const [stepOne, setStepOne] = useState(true);
    const [stepTwo, setStepTwo] = useState(false);
    const [stepThree, setStepThree] = useState(false);
    const [successMessage, setSuccesMessage] = useState('');

    const [showPassword, setShowPassword] = useState(true);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const [showConfirmPassword, setShowConfirmPassword] = useState(true);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

    const [email, setEmail] = useState('');
    const [resetCode, setResetCode] = useState('');

    const schemaEmail = yup.object().shape({
        email: yup.string().required('Câmp obligatoriu').email('Adresă de email invalidă'),
    });
    const {control: controlEmail, handleSubmit: handleSubmitEmail, formState: {errors: emailErrors}} = useForm({
        resolver: yupResolver(schemaEmail),
        defaultValues: {email: ''}
    });

    const schemaPassword = yup.object().shape({
        password: yup.string().required('Câmp obligatoriu').min(8, 'Lungimea minimă este de 8 caractere').max(15, 'Lungimea maximă este de 15 caractere'),
        confirmPassword: yup.string().required('Câmp obligatoriu').oneOf([yup.ref('password'), null], 'Parolele introduse nu coincid')
    });
    const {control: controlPassword, handleSubmit: handleSubmitPassword, formState: {errors: passwordErrors}} = useForm({
        resolver: yupResolver(schemaPassword),
        defaultValues: {password: '', confirmPassword: ''}
    });

    const onSubmitEmail = (data) => {
        setEmail(data.email);
        axios.post(`http://${process.env.IP_ADDRESS}:8082/reset-password/generate-reset-code`, {
            email: data.email
        })
        .then((response) => {
            setStepOne(false);
            setStepTwo(true);
        })
        .catch((error) => {
            Alert.alert('A intervenit o eroare. Vă rugăm să încercați mai târziu.');
        });
    }

    const validateResetCode = () => {
        axios.post(`http://${process.env.IP_ADDRESS}:8082/reset-password/validate-reset-code`, {
            email: email,
            reset_code: resetCode
        })
        .then((response) => {
            if(response.status === 200)
            {
                setStepTwo(false);
                setStepThree(true);
            }
        })
        .catch((error) => {
            if(error.response.status === 400)
            {
                Alert.alert(error.response.data);
            }
            else
            {
                Alert.alert('A intervenit o eroare. Vă rugăm să încercați mai târziu.');
            }
        });
    }

    const onSubmitPassword = (data) => {
        axios.put(`http://${process.env.IP_ADDRESS}:8082/reset-password/reset-password`, {
            email: email,
            password: data.password
        })
        .then((response) => {
            if(response.status === 200)
            {
                setSuccesMessage('Parola a fost resetată cu success');
            }
        })
        .catch((error) => {
            Alert.alert('A intervenit o eroare. Vă rugăm să încercați mai târziu.');
        });
    }

    return(
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <Text style={{color: '#6961A8', fontSize: 18, marginBottom: 35}}><FontAwesomeIcon icon={faReply} style={{color: '#6961A8'}} size={15}/> Înapoi</Text>
            </TouchableOpacity>
            <View style={styles.header}>
                <Text style={styles.title}>Resetare parolă</Text>
            </View>
            <View style={styles.viewForm}>
                {
                    stepOne && (
                        <>
                            <Text style={styles.info}>Vă rugăm să introduceți adresa de email asociată contului dvs. pentru a primi codul de resetare a parolei.</Text>
                            <Controller
                                control={controlEmail}
                                render={({field: {onChange, value}}) => (
                                    <View style={styles.viewTextInput}>
                                        <FontAwesomeIcon icon={faAt} style={styles.icon} size={15}/>
                                        <TextInput 
                                            style={styles.textInput}
                                            placeholder='Email'
                                            onChangeText={onChange}
                                            value={value}
                                        /> 
                                    </View>
                                )}
                                name='email'
                            />
                            {emailErrors.email && <Text style={styles.error}>{emailErrors.email.message}</Text>}
                            <View style={styles.viewButton}>
                                <TouchableOpacity style={styles.buttonSubmit} onPress={handleSubmitEmail(onSubmitEmail)}>
                                    <Text style={styles.textButtonSubmit}>Trimite codul</Text>
                                    <FontAwesomeIcon icon={faPaperPlane} style={{color: '#6961A8', marginLeft: 15, marginRight: 5}} size={20}/>
                                </TouchableOpacity>
                            </View>
                        </>
                    )
                }
                {
                    stepTwo && (
                        <>
                            <Text style={styles.info}>Dacă adresa de email este corectă, veți primi un cod de resetare pe care vă rugăm să-l introduceți în câmpul de mai jos.</Text>
                            <View style={styles.viewTextInput}>
                                <FontAwesomeIcon icon={faShieldHalved} style={styles.icon} size={15}/>
                                <TextInput 
                                    style={styles.textInput}
                                    placeholder='Introduceți codul de resetare'
                                    onChangeText={(text) => setResetCode(text)}
                                    value={resetCode}
                                /> 
                            </View>
                            <View style={styles.viewButton}>
                                <TouchableOpacity style={styles.buttonSubmit} onPress={() => validateResetCode()}>
                                    <Text style={styles.textButtonSubmit}>Validează codul</Text>
                                    <FontAwesomeIcon icon={faCircleRight} style={{color: '#6961A8', marginLeft: 10}} size={30}/>
                                </TouchableOpacity>
                            </View>
                        </>
                    )
                }
                {
                    (stepThree && successMessage === '') && (
                        <>
                            <Controller
                                control={controlPassword}
                                render={({field: {onChange, value}}) => (
                                    <View style={styles.viewTextInput}>
                                        <FontAwesomeIcon icon={faLock} style={styles.icon} size={15}/>
                                        <TextInput
                                            style={styles.textInput}
                                            placeholder='Introduceți noua parolă'
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
                            {passwordErrors.password && <Text style={styles.error}>{passwordErrors.password.message}</Text>}
                            <Controller
                                control={controlPassword}
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
                            {passwordErrors.confirmPassword && <Text style={styles.error}>{passwordErrors.confirmPassword.message}</Text>}
                            <View style={styles.viewButton}>
                                <TouchableOpacity style={styles.buttonSubmit} onPress={handleSubmitPassword(onSubmitPassword)}>
                                    <Text style={styles.textButtonSubmit}>Resetează</Text>
                                    <FontAwesomeIcon icon={faCircleRight} style={{color: '#6961A8', marginLeft: 10}} size={30}/>
                                </TouchableOpacity>
                            </View>
                        </>
                    )
                }
                {successMessage &&  
                    (
                        <View style={styles.successView}>
                            <View style={styles.iconContainer}>
                                <FontAwesomeIcon icon={faCheckCircle} style={styles.iconSuccess} size={50}/>
                            </View>
                            <Text style={styles.successMessage}>{successMessage}</Text>
                        </View>
                    )
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 40,
        top: 60,
        flex: 1,
        backgroundColor: '#FBFBFB',
        paddingLeft: 20,
        paddingRight: 20
    },
    header: {
        alignItems: 'center',
        marginBottom: 20
    },
    title:{
        fontSize: 24,
        paddingLeft: 10
    },
    viewForm: {
        top: 30,
        flex: 1,
        gap: 10
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
    info: {
        fontSize: 16,
        marginBottom: 15
    },
    viewButton: {
        marginTop: 15,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    buttonSubmit: {
        marginTop: 5,
        height: 50,
        width: 'max-content',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        flexDirection: 'row',
        borderColor: '#6961A8',
        borderWidth: 2,
        borderRadius: 10
    },
    textButtonSubmit: {
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
    successView: {
        flexDirection: 'column',
        alignItems: 'center',
        padding: 50,
        backgroundColor: '#e0ffe0'
    },
    iconContainer: {
        margin: 30
    },
    iconSuccess: {
        color: '#28a745',
    },
    successMessage: {
        fontSize: 20,
        color: '#28a745', 
        marginBottom: 30
    }
});