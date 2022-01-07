import React, { useEffect, useState } from 'react';
import "./Header.css";
import Logo from "../../assets/logo.svg";
import { Modal, Box, Tabs, Tab, Button } from '@mui/material';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';

const Header = function(props){

    let baseUrl = 'http://localhost:8085/api/v1';
    let registerEndPoint = '/signup';
    let loginEndPoint = '/auth/login';
    let [authToken, setAuthToken] = useState(undefined);
    const [isModalOpen, setModalOpen] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState(0);
    const [loginForm, setLoginForm] = React.useState({username: '', password: ''});
    const [registerForm, setRegisterForm] = React.useState({firstName: '', lastName: '', email: '', password: '', phone: ''});

    const loginModalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };
    useEffect(() => {
        let token = sessionStorage.getItem('token-bookmymovie');
        if(token != '' && token != undefined){
            setAuthToken(token);
        }
    }, []);

    const showLogin = async () => {
        console.log('login');
        // fetch('http://localhost:8085/api/v1/movies?page=1&limit=10').then((raw) => {
        //     raw.json().then((resp) => {console.log(resp)})
        // })
        
        setModalOpen(true);
    }

    const showLogout = () => {
        console.log('logout');
        setModalOpen(true);
    }

    const handleModalClose = () => {
        setModalOpen(false);
    }

    const handleTabSwitch = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleUsernameChange = (event) => {
        let username = event.target.value;
        setLoginForm({...loginForm, username })
    }

    const handlePasswordChange = (event) => {
        let password = event.target.value;
        setLoginForm({...loginForm, password })
    }

    const onLogin = async () => {
        try{
            let accesskey = window.btoa(`${loginForm.username}:${loginForm.password}`);
            const headers = new Headers();
            headers.append('Authorization', `Basic ${accesskey}`);

            let rawResponse = await fetch(baseUrl+loginEndPoint, {
                method: 'POST',
                headers: headers
            });
    
            console.log('login requested', rawResponse, rawResponse.body);
        } catch (e){
            console.log(e);
        }
    }

    const handleRegisterFormChange = (event) => {
        let formField = event.target.name;
        let fieldValue = event.target.value;
        let newForm = {...registerForm};
        newForm[formField] = fieldValue;
        setRegisterForm(newForm);
    }

    const onRegister = async () => {
        try{
            let data = {
                email_address: registerForm.email,
                first_name: registerForm.firstName,
                last_name: registerForm.lastName,
                mobile_number: registerForm.phone,
                password: registerForm.password
            }
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');

            let rawResponse = await fetch(baseUrl+registerEndPoint, {
                method: 'POST',
                headers: headers,
                body: data
            });
    
            console.log('register requested', rawResponse, rawResponse.body);
        } catch (e){
            console.log(e);
        }
    }

    let type = ( authToken == '' || authToken == undefined)? 'login': 'logout';

    let button;
    if(type == 'logout'){
        button = <Button variant="contained" onClick={showLogout}>Logout</Button>
    } else {        
        button = <Button variant="contained" onClick={showLogin}>Login</Button>
    }
    return (
        <header>
            <div className='left'>
                <img src={Logo} alt="Logo" className='spin' />
            </div>
            <div className='right'>
                {button}
                <Button variant="contained" color="primary">Book Show</Button>
            </div>
            <Modal
                open={isModalOpen}
                onClose={handleModalClose}
                aria-labelledby="login-modal"
                aria-describedby="login to application"
                >
                <Box sx={{ width: '100%', ...loginModalStyle }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', color: 'red' }}>
                        <Tabs value={activeTab} onChange={handleTabSwitch} aria-label="basic tabs example" sx={{indicatorColor: 'red', borderColor: 'red'}}>
                            <Tab label="Login" aria-labelledby="simple-tabpanel-login" aria-describedby="login existing user" />
                            <Tab label="Register" aria-labelledby="simple-tabpanel-register" aria-describedby="register new user" />
                        </Tabs>
                    </Box>
                    <div
                        role="tabpanel"
                        hidden={activeTab !== 0}
                        id="simple-tabpanel-login"
                        aria-labelledby="simple-tab-login">
                        <div className='login-container'>                            
                            <ValidatorForm className="login-form" onSubmit={onLogin}>                                    
                                <TextValidator
                                    id="username" name="username" label="Username *" type="text" value={loginForm.username} onChange={handleUsernameChange}
                                    validators={["required"]} errorMessages={['Username is required']} variant="standard">
                                </TextValidator>
                                <TextValidator
                                    id="password" name="password" label="Password *" type="password" value={loginForm.password} onChange={handlePasswordChange}
                                    validators={["required"]} errorMessages={['Password is required']} variant="standard">
                                </TextValidator>
                                <div className="login-button">                                
                                    <Button type="submit" variant="contained">Login</Button>
                                </div>
                            </ValidatorForm>
                        </div>
                    </div>
                    <div
                        role="tabpanel"
                        hidden={activeTab !== 1}
                        id="simple-tabpanel-register"
                        aria-labelledby="simple-tab-register">
                        <div className='register-container'>
                            <ValidatorForm className="register-form" onSubmit={onRegister}>                                    
                                <TextValidator
                                    id="firstName" name="firstName" label="First Name *" type="text" value={registerForm.firstName} onChange={handleRegisterFormChange}
                                    validators={["required"]} errorMessages={['required']} variant="standard">
                                </TextValidator>
                                <TextValidator
                                    id="lastName" name="lastName" label="Last Name *" type="text" value={registerForm.lastName} onChange={handleRegisterFormChange}
                                    validators={["required"]} errorMessages={['required']} variant="standard">
                                </TextValidator>
                                <TextValidator
                                    id="email" name="email" label="Email" type="Email *" value={registerForm.email} onChange={handleRegisterFormChange}
                                    validators={["required"]} errorMessages={['required']} variant="standard">
                                </TextValidator>
                                <TextValidator
                                    id="newPassword" name="password" label="Password *" type="password" value={registerForm.password} onChange={handleRegisterFormChange}
                                    validators={["required"]} errorMessages={['required']} variant="standard">
                                </TextValidator>
                                <TextValidator
                                    id="phone" name="phone" label="Contact No *" type="number" value={registerForm.phone} onChange={handleRegisterFormChange}
                                    validators={["required"]} errorMessages={['required']} variant="standard">
                                </TextValidator>
                                <div className="register-button">                                
                                    <Button type="submit" variant="contained">Register</Button>
                                </div>
                            </ValidatorForm>
                        </div>
                    </div>
                </Box>
            </Modal>
        </header>
    );
};

export default Header;