import React, { Component } from 'react';
import { View, Text, Button ,TextInput , Image,NavigatorIOS, Slider,StyleSheet} from 'react-native';
import firebase from 'firebase';
import ActionButton from './ActionButton';
import CameraScreen from './CameraScreen';




export default class ProfilePage extends Component {
    constructor(props){
        super(props);
        this.state ={
            name:'',
            image:null,
            distance:0,
            latitude: null,
            longitude: null,
            address:''
        };
    }

    saveInfo(){
        console.log("Save");
    }

    componentDidMount(){
        navigator.geolocation.getCurrentPosition(
            (position) => {
               console.log("Geocoder",position);
               let location = {lat:position.coords.latitude,lng:position.coords.longitude};
               this.setState({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                error: null,
              });
            },
            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
        );
    }
    
    render () {
        return (
            <View style={{flex:1}}>
            <View style={{flex:2,flexDirection:'row'}} >
                <View style ={{flex:1}}>
                <TextInput
                    autoCorrect={false}
                    placeholder={"Name"}
                    value={this.state.name}
                    onChangeText={name => this.setState({ name })}
                    style={styles.inputStyle}
                />
                </View>
                <View style ={{flex:1}}>
                    <CameraScreen/>
                </View>
            </View>
            <View style={{flex:1}}>
                <Text style={styles.text}>Radius from current Location: {this.state.distance} km</Text>
                <Slider maximumValue={20} 
                        minimumValue={5} 
                        onValueChange={(distance)=> this.setState({distance})} 
                        step={1} 
                        value={this.state.distance}
                        style={styles.slider}/>
            </View>
            <View style={{flex:1}}>
                <Text>Latitude: {this.state.latitude}</Text>
                <Text>Longitude: {this.state.longitude}</Text>
                <Text>Address: {this.state.address}</Text>
            </View>
            <View style={{flex:1}}>
                <ActionButton onPress={this.saveInfo.bind(this)} title="Save" />
            </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    inputStyle: {
        paddingRight: 1,
        paddingLeft: 20,
        paddingBottom: 1,
        color: '#262626',
        fontSize: 18,
        fontWeight: '200',
        flex: 1,
        justifyContent:'center',
        height: 40,
    },
    slider:{
        marginLeft:20,
        marginRight:20,
    },
    text:{
        color:'#000',
        marginLeft:20,
        marginBottom:10
    }
});