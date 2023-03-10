import * as React from 'react';
import { Button, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'react-native';
import { useState } from 'react';
import { TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native';
import { StyleSheet } from 'react-native';
import { useEffect } from 'react';
import {createContext, useMemo, useCallback, useContext} from 'react'
import { loginApi } from '../../App';
import messaging from '@react-native-firebase/messaging';
import { testUrl, url } from '../../keys';

// Creating login screen with passed in hooks from main app and navigation
const LoginScreen = ({route, navigation}) => {

  // Username request
  const [usernameLocal, setUsernameLocal] = useState('')

  // Password request
  const [passwordEntry, setPasswordEntry] = useState('')

  // Hooks for global state, containing current user info
  const { isSignedIn, signIn, name, setName, token, setToken, username, setUsername, notifToken, setNotifToken } = useContext(loginApi)

  // Gets the FCM notification token
  const getFCMToken = async () => {
    try {
      const newToken = await messaging().getToken();
      setNotifToken(newToken)
    } catch (e) {
      console.log(error);
    }
  }

  // On load, get the FCM token
  useEffect(() => {
    getFCMToken();
  },[]);

  return (

    <View style = {loginMainStyles.center}>

      <Image
        style = {loginMainStyles.logoMain}
        source = {require('../../assets/app-logo.png')}
      >
        
      </Image>
      <Text style = {{fontSize : 30, paddingBottom: 10}}> Get Connected </Text>

      <View
        style = {loginMainStyles.login}
      >

      <TextInput
        onChangeText = {setUsernameLocal}
        value = {usernameLocal}
        placeholder = "Username"
      >
        
      </TextInput>

      <TextInput
        secureTextEntry = {true}
        onChangeText = {setPasswordEntry}
        value = {passwordEntry}
        placeholder = "Password"
      >

      </TextInput>
      
      </View>


      <View
      >

        <View
          style = {loginMainStyles.buttonBox}
        >

          <TouchableOpacity
            style = {loginMainStyles.loginButton}
            title = "Submit"

            // Login button, requests a user with the given username and password from server
            onPress = {() => {
              try {
                
                fetch(testUrl + '/get-user', {
                    method: 'POST',
                    headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      "username": usernameLocal,
                      "password": passwordEntry,
                      "token" : notifToken
                    }),
                  })
              
                .then(async res => { 
                    try {
                        const jsonRes = await res.json();
                        if (res.status === 200) {
                            console.log(jsonRes)
                            console.log("Successful login");

                            // Set the global hooks
                            setName(jsonRes.firstname)
                            setToken(jsonRes.password)
                            setUsername(jsonRes.username)
                            signIn(true)

                        }
                        else {                          
                          console.log(jsonRes.message);
                        }
                    } catch (err) {
                        
                        console.log(err);
                    };
                })
                .catch(err => {
                    console.log("error here")
                    console.log(err);
                });
              } catch (err) {
                console.log("error here")
                console.log(err);
              }
            }
            }
          >
          <Text style = {loginMainStyles.loginText}> Login </Text>
      </TouchableOpacity>

        </View>
    
        <View style = {loginMainStyles.signupBox}>

          <Text> Don't have an account? </Text>
          <TouchableOpacity
            style = {loginMainStyles.signupButton}
            
            onPress = {() =>
              navigation.navigate('Signup Home')
            }
          >
            <Text style = {loginMainStyles.signupText}> Sign-up</Text>

          </TouchableOpacity>

        </View>
       

      </View>

    </View>

  );
}



export default LoginScreen;

const loginMainStyles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  loginText: {
    fontSize: 15,
  },
  signupText: {
    fontSize: 10,
  },
  login: {
    width: 275,
  },
  loginButton: {
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'black',
    alignItems: "center",
    backgroundColor: "lavender",
    padding: 8,
  },
  signupButton: {
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: 'black',
    alignItems: "center",
    backgroundColor: "lavender",
    padding: 5
  },
  buttonBox: {
    
    padding: 20
  },
  signupBox: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  logoMain: {
    width: 125,
    height: 125
  }
})