import React, { Component } from 'react';
import { View, Text, Button ,TextInput , Image,NavigatorIOS} from 'react-native';
import firebase from 'firebase';
import ActionButton from './ActionButton';
import styles from '../styles';
const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  AccessToken
} = FBSDK;
import {
    StackNavigator,
} from 'react-navigation';
import SwipeCards from './SwipeCards';  
import MessageContainer from './MessageContainer';
import ChatList from './ChatList';


export default class LoginForm extends Component {
    constructor(props){
      super(props);
      this.state = { email: '', password: '', error: '', loading: false,isLoggedIn:false};
    }
  
    onLoginPress() {
        this.setState({ error: '', loading: true });

        const { email, password } = this.state;
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(() => { this.setState({ error: '', loading: false ,isLoggedIn:true}); })
            .catch(() => {
                //Login was not successful, let's create a new account
                firebase.auth().createUserWithEmailAndPassword(email, password)
                    .then(() => { 
                        let user = firebase.auth().currentUser;
                        console.log("User data", user.uid,user.displayName,user.email);
                        var rootRef = firebase.database().ref();
                        let varToPush = {}
                        varToPush[user.uid] ={name:user.displayName,email:user.email,interested:{title:"testing"}};
                        rootRef.child('users').update(varToPush).then((result)=>{
                            rootRef.child('users').child(user.uid).child('messages').push({_id:"1234",user:{_id:'help',name:'Help Bot'},text:'Please try me'});
                            this.setState({ error: '', loading: false ,isLoggedIn:true});
                        });

                })
                    .catch(() => {
                        this.setState({ error: 'Authentication failed.', loading: false });
                    });
            });
    }

    onLoginWithFB(){
        this.setState({ error: '', loading: true });
        const credential = new firebase.auth.FacebookAuthProvider().credential;
        firebase.auth().signInWithCredential(credential).then((result)=>{
             if (result.credential) {
             // This gives you a Facebook Access Token. You can use it to access the Facebook API.
             var token = result.credential.accessToken;
             console.log(token,"FB Token");
             this.setState({ error: '', loading: false });
           }
        },(error) => {
         this.setState({ error: 'Authentication failed. with error' + error.message, loading: false });
        })
        // LoginManager.logInWithReadPermissions(['public_profile']).then((result) => {
        //     if(result.isCancelled){
        //         console.log("Login calcelled");
        //     }else{
        //         console.log("FB Accesscode",accessTokenData);
        //         AccessToken.getCurrentAccessToken().then((accessTokenData) => {
        //            const credential = new firebase.auth.FacebookAuthProvider().credential(accessTokenData);
        //            firebase.auth().signInWithRedirect(credential).then((result)=>{
        //                 if (result.credential) {
        //                 // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        //                 var token = result.credential.accessToken;
        //                 console.log(token,"FB Token");
        //                 this.setState({ error: '', loading: false });
        //               }
        //            },(error) => {
        //             this.setState({ error: 'Authentication failed. with error' + error.message, loading: false });
        //            })
                // })
        //     }
        // });
    }

    renderButtonOrSpinner() {
        if (this.state.loading) {
          return <Button disabled title="Loading" />;
        }

        return( <View style={{flex:3}}>
                <ActionButton onPress={this.onLoginPress.bind(this)} title="Login" />
                <ActionButton onPress={this.onLoginWithFB.bind(this)} title="Login with FB" />
                
                {/* <LoginButton
                publishPermissions={["publish_actions"]}
                onLoginFinished={
                    (error, result) => {
                    if (error) {
                        alert("login has error: " + result.error);
                    } else if (result.isCancelled) {
                        alert("login is cancelled.");
                    } else {
                        AccessToken.getCurrentAccessToken().then(
                        (data) => {
                            alert(data.accessToken.toString())
                        }
                        )
                    }
                    }
                }
                onLogoutFinished={() => alert("logout.")}/> */}
                </View>
              );
    }
    
    render() {
        if(this.state.isLoggedIn){
            return <MessageContainer/>
        }else{
            return (
                <View style={{flex:1,top:30}}>
                    <Image
                    source={require('../assets/Logo.png')}
                    style={{flex:4,width:null,height:null}}/>
                    <Image
                    source={require('../assets/CoverPic.jpg')}
                    style={{flex:5,width:null,height:null}}/>
                    <TextInput
                        autoCorrect={false}
                        placeholder={"Please Enter Email"}
                        value={this.state.email}
                        onChangeText={email => this.setState({ email })}
                        style={styles.inputStyle}
                    />
                    <TextInput
                        autoCorrect={false}
                        placeholder={"Please Enter Pasword"}
                        value={this.state.password}
                        onChangeText={password => this.setState({ password })}
                        style={styles.inputStyle}
                        secureTextEntry={true}
                    />   
                    <Text style={styles.errorTextStyle}>{this.state.error}</Text>
                    {this.renderButtonOrSpinner()}
                </View>
            );
        }
    }
}
