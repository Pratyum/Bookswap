/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  AlertIOS,
  ListView,
  Button
} from 'react-native';
import * as firebase from 'firebase';
const StatusBar = require('./components/StatusBar');
const ActionButton = require('./components/ActionButton');
const ListItem = require('./components/ListItem');
const styles = require('./styles.js');
import LoginForm from './components/loginForm';
import Swiper from 'react-native-deck-swiper';
import SwipeCards from './components/SwipeCards';
import CameraScreen from './components/CameraScreen';
import ProfilePage from './components/Profile';
import MessageContainer from './components/MessageContainer';

// Initialize Firebase
var firebaseConfig = {
  apiKey: "AIzaSyDhMz0YWUf-7sz6D12UcHLgJRHm1YSbqC0",
  authDomain: "bookswap-21d7b.firebaseapp.com",
  databaseURL: "https://bookswap-21d7b.firebaseio.com",
  projectId: "bookswap-21d7b",
  storageBucket: "bookswap-21d7b.appspot.com",
  messagingSenderId: "946876999280"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

// Create a reference with .ref() instead of new Firebase(url)
const rootRef = firebase.database().ref();
const itemsRef = rootRef.child('items');
const usersRef = rootRef.child('users');



export default class App extends Component {
  
    constructor(props) {
      super(props);
      this.state = {
        dataSource: new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1 !== row2,
        }),
      };
      this.itemsRef = this.getRef().child('items');
      this.usersRef = this.getRef().child('users');
    }
  
    getRef() {
      return firebaseApp.database().ref();
    }
    
    listenForItems(itemsRef) {
      itemsRef.on('value', (snap) => {
        // get children as an array
        var items = [];
        snap.forEach((child) => {
          items.push({
            title: child.val().email,
            _key: child.key
          });
        });
        console.log("Items", items)
        this.setState({
          items:items,
          dataSource: this.state.dataSource.cloneWithRows(items)
        });
        console.log("State values",this.state);
  
      });
    }    

    // componentDidMount() {
    //   this.listenForItems(this.itemsRef);
    // }

    componentDidMount() {
      this.listenForItems(this.usersRef);
    }

    render() {

      // return (
      //   <ProfilePage/>
      // )


      // return (
      //   <CameraScreen/>
      // )

      // return (
      //   <MessageContainer/>
      // )
      
      return (
        <LoginForm/>
      )

      // return (
      //   <View style={styles.container}>
      //     <SwipeCards data={this.state.items} 
      //                 onSwipeLeft={this.onSwipeLeft.bind(this)}
      //                 onSwipeRight={this.onSwipeRight.bind(this)}/>
      //     <ActionButton onPress={this._addItem.bind(this)} title="Add" />          
      //   </View>
      // )

      return (
        <View style={styles.container}>
          <StatusBar title="Book List" />
          <ListView
            dataSource={this.state.dataSource}
            renderRow={this._renderItem.bind(this)}
            enableEmptySections={true}
            style={styles.listview}/> 
          <ActionButton onPress={this._addItem.bind(this)} title="Add" />
        </View>
      )

    }
  
    _addItem() {
      AlertIOS.prompt(
        'Add New Item',
        null,
        [
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {
            text: 'Add',
            onPress: (text) => {
              this.itemsRef.push({ title: text })
            }
          },
        ],
        'plain-text'
      );
    }
  
    _renderItem(item) {
      console.log(item);
      const onPress = () => {
        AlertIOS.alert(
          'Complete',
          null,
          [
            {text: 'Complete', onPress: (text) => this.itemsRef.child(item._key).remove()},
            {text: 'Cancel', onPress: (text) => console.log('Cancelled')}
          ]
        );
      };
  
      return (
        <ListItem item={item} onPress={onPress} />
      );
    }
  
}
