import React, { Component } from "react";
import { Text, View, StyleSheet, Platform, StatusBar, Alert, FlatList, Image, ImageBackground, Dimensions, SafeAreaView } from "react-native";
import axios from 'axios';

export default class MeteorScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            meteors: {}
        }
    }

    componentDidMount() {
        this.getMeteors()
    }

    //função para a obtenção dos dados por meio da API
    getMeteors = () => {
        axios
            .get("https://api.nasa.gov/neo/rest/v1/feed?&api_key=KpVUuy1whGMY5g79zRJfBnmg9ihJVAPrGl4DXXpq")
            .then(response => {
                this.setState({ meteors: response.data.near_earth_objects })
            })
            .catch(error => {
                alert(error.message)
            })
    }

    //exibir os meteoros de acordo com a pontuação de ameaça
    renderItem = ({ item }) => {
        let meteor = item;
        let bg_img, speed, size;

        if (meteor.threat_score <= 30) {
            bg_img = require("../assets/meteor_bg1.png")
            speed = require("../assets/meteor_speed1.gif")
            size = 100
        } else if (meteor.threat_score <= 75) {
            bg_img = require("../assets/meteor_bg2.png")
            speed = require("../assets/meteor_speed2.gif")
            size = 150
        } else {
            bg_img = require("../assets/meteor_bg3.png")
            speed = require("../assets/meteor_speed3.gif")
            size = 200
        }
        //diferenciar os meteoros de acordo com a pontuação de ameaça (threat_scores)
        return (
            <View>
                <ImageBackground source={bg_img} style={styles.backgroundImage}>
                    <View styles={styles.gifContainer}>
                        <Image source={speed} style={{ width: size, height: size, alignSelf: "center" }} />
                        <View>
                            <Text style={[styles.cardTitle, { marginTop: 400, marginLeft: 50 }]}> {item.name} </Text>
                            <Text style={[styles.cardText, { marginTop: 20, marginLeft: 50 }]}>
                                Mais próximo da Terra - {" "}
                                {item.close_approach_data[0].close_approach_date_full}
                            </Text>
                            <Text style={[styles.cardText, { marginTop: 5, marginLeft: 50 }]}>
                                Diâmetro Mínimo (KM) - {" "}
                                {item.estimated_diameter.kilometers.estimated_diameter_min}
                            </Text>
                            <Text style={[styles.cardText, { marginTop: 5, marginLeft: 50 }]}>
                                Diâmetro Máximo (KM) - {" "}
                                {item.estimated_diameter.kilometers.estimated_diameter_max}
                            </Text>
                            <Text style={[styles.cardText, { marginTop: 5, marginLeft: 50 }]}>
                                Velocidade (KM/H) - {" "}
                                {item.close_approach_data[0].relative_velocity.kilometers_per_hour}
                            </Text>
                            <Text style={[styles.cardText, { marginTop: 5, marginLeft: 50 }]}>
                                Distância da Terra (KM) - {" "}
                                {item.close_approach_data[0].miss_distance.kilometers}
                            </Text>
                        </View>
                    </View>
                </ImageBackground>
            </View>
        );
    }

    render() {
        if (Object.keys(this.state.meteors).lenght === 0) {
            return (
                <View style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <Text>Carregando...</Text>
                </View>
            )
        } else {
            let meteor_arr = Object.keys(this.state.meteors).map(meteor_date => {
                return this.state.meteors[meteor_date]
            })
            //calculando a pontuação de ameaça / juntando todas as matrizes dentro de meteor_arr
            let meteors = [].concat.apply([], meteor_arr);
            meteors.forEach(function (element) {
                //cálculo do diâmetro médio
                let diameter =
                    (element.estimated_diameter.kilometers.estimated_diameter_min +
                        element.estimated_diameter.kilometers.estimated_diameter_max) /
                    2;
                //cálculo da pontuação de ameaça
                let threatScore =
                    (diameter / element.close_approach_data[0].miss_distance.kilometers) *
                    1000000000;
                element.threat_score = threatScore;
            });

            //lógica para mostrar somente os 5 mais perigosos
            meteors.sort(function (a, b) {
                return b.threat_score - a.threat_score
            })
            meteors = meteors.slice(0, 5);

            //preparando para receber os meteoros na tela
            return (
                <View style={styles.container}>
                    <SafeAreaView style={styles.droidSafeArea} />
                    {/* usar FlatList para pegar a matriz de dados e processa todos os dados de maneira semelhante. */}
                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={meteors}
                        renderItem={this.renderItem}
                        horizontal={true}
                    />
                </View>
            );
        }
    }
}

// Estilos
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    droidSafeArea: {
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: "cover",
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
    },
    titleBar: {
        flex: 0.15,
        justifyContent: "center",
        alignItems: "center",
    },
    titleText: {
        fontSize: 30,
        fontWeight: "bold",
        color: "white",
    },
    meteorContainer: {
        flex: 0.85,
    },
    listContainer: {
        backgroundColor: "rgba(52, 52, 52, 0.5)",
        justifyContent: "center",
        marginLeft: 10,
        marginRight: 10,
        marginTop: 5,
        borderRadius: 10,
        padding: 10,
    },
    cardTitle: {
        fontSize: 20,
        marginBottom: 10,
        fontWeight: "bold",
        color: "white",
    },
    cardText: {
        color: "white",
    },
    threatDetector: {
        height: 10,
        marginBottom: 10,
    },
    gifContainer: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
    },
    meteorDataContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
});