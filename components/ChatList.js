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
const StatusBar = require('./StatusBar');
const ActionButton = require('./ActionButton');
const ListItem = require('./ListItem');
const styles = require('../styles.js');

export default class ChatList extends Component {
  
    constructor(props) {
      super(props);
      this.state = {
        dataSource: new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1 !== row2,
        }),
      };
      this.user = firebase.auth().currentUser;
      if(this.user!= null){
        this.usersRef = this.getRef().child('users').child(this.user.uid);
      }

    }
  
    getRef() {
      return firebase.database().ref();
    }
    
    listenForMatches(itemsRef) {
      itemsRef.on('value', (snap) => {
        // get children as an array
        var items = [];
        snap.forEach((child) => {
          items.push({
            title: child.val().email,
            _key: child.key
          });
        });
        this.setState({
          items:items,
          dataSource: this.state.dataSource.cloneWithRows(items)
        });
        console.log("State values",this.state);
  
      });
    }    

    componentDidMount() {
      if(this.usersRef != undefined){
        this.listenForMatches(this.usersRef.child('matched'));
      }
    }

    render() {

      return (
        <View style={styles.container}>
          <StatusBar title="Matched Users" />
          <ListView
            dataSource={this.state.dataSource}
            renderRow={this._renderItem.bind(this)}
            enableEmptySections={true}
            style={styles.listview}/> 
          {/* <ActionButton onPress={this._addItem.bind(this)} title="Add" /> */}
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
        //TODO: Implment Navigation to Chat room.   


        // AlertIOS.alert(
        //   'Complete',
        //   null,
        //   [
        //     {text: 'Complete', onPress: (text) => this.itemsRef.child(item._key).remove()},
        //     {text: 'Cancel', onPress: (text) => console.log('Cancelled')}
        //   ]
        // );
      };
  
      return (
        <ListItem item={item} onPress={onPress} />
      );
    }
  
}
