import React, {Component} from "react";
import {Text, View, StyleSheet, ImageBackground, SafeAreaView, Platform, StatusBar, Image} from "react-native";
import MapView, {Marker} from "react-native-maps";
import axios from 'axios';

export default class IssLocationScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: {}
        }
    }

    componentDidMount() {
        this.getIssLocation();
    }

    //Função para obter os dados da EEI 
    getIssLocation = () => {
        //obter os dados da API
        axios
            .get("https://api.wheretheiss.at/v1/satellites/25544")
            //definir resposta 
            .then(response => {
                this.setState({ location: response.data })
            })
            //pegar qualquer erro e mostrar usando caixa de alerta
            .catch(error => {
                alert(error.message)
            })
    }
    render() {
        if (Object.keys(this.state.location).length === 0) {
            return (
                <View style = {{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text> Loading... </Text>
                </View>
            )
        }
        else {
            return (
                <View style = {styles.container}>
                    <SafeAreaView style = {styles.droidSafeArea} />
                    <ImageBackground source = {require("../assets/iss_bg.jpg")} style = {styles.backgroundImage}>
                        <View style = {styles.titleContainer}>
                            <Text style = {styles.titleText}> Localização da EEI </Text>
                        </View>
                        <View style = {styles.mapContainer}>
                            <MapView style = {styles.map}
                                region = {{
                                    latitude: this.state.location.latitude,
                                    longitude: this.state.location.longitude,
                                    latitudeDelta: 100,
                                    longitudeDelta: 100
                                }}>
                                <Marker coordinate = {{
                                    latitude: this.state.location.latitude,
                                    longitude: this.state.location.longitude
                                }}>
                                    <Image source = {require("../assets/iss_icon.png")} style = {{ height: 50, width: 50 }} />
                                </Marker>
                            </MapView>
                        </View>
                        {/* adicionar caixa de informações */}
                        <View style = {styles.infoContainer}>
                            <Text style = {styles.infoText}>Latitude: {this.state.location.latitude}</Text>
                            <Text style = {styles.infoText}>Longitude: {this.state.location.longitude}</Text>
                            <Text style = {styles.infoText}>Altitude (KM): {this.state.location.altitude}</Text>
                            <Text style = {styles.infoText}>Velocidade (KM/H): {this.state.location.velocity}</Text>
                        </View>
                    </ImageBackground>
                </View>
            )
        }
    }

}

//estilos
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    droidSafeArea: {
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    //imagem de fundo
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    //titulo
    titleContainer: {
        flex: 0.1,
        justifyContent: "center",
        alignItems: "center"
    },
    titleText: {
        fontSize: 30,
        fontWeight: "bold",
        color: "white"
    },
    //mapa
    mapContainer: {
        flex: 0.7
    },
    map: {
        width: "100%",
        height: "100%"
    },
    // caixa de informações
    infoContainer: {
        flex: 0.2,
        backgroundColor: 'white',
        marginTop: -10,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 30
    },
    infoText: {
        fontSize: 15,
        color: "black",
        fontWeight: "bold"
    }
})