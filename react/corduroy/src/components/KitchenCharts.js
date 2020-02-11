import React, { Component } from 'react';
import {Container, Col, Row} from 'react-bootstrap';
import DateTimePicker from 'react-datetime-picker';
import '../App.css';
var Chart = require('chart.js');

Chart.defaults.global.responsive = true;


class KitchenCharts extends Component{
    constructor(props) {
        super(props);
        this.state = {
            date1: new Date(new Date() - 86400000),
            date2: new Date(),
            roomData: [],
            moveData: []
        };

        this.temps = [];
        this.lux = [];
        this.humid = [];
        this.timePoints = [];
        this.moveFreq = [];
        this.moveTime = [];


        this.getData = this.getData.bind(this);
        this.getMovement = this.getMovement.bind(this);
    }

    getData(roomName) {
        fetch("/data/graph?room="+roomName, {method: 'GET'}).then(
            res => res.json()).then(
            res => this.setState({'roomData': res})
        )
    }

    getMovement(roomName) {
        fetch("data/moveGraph?room="+roomName, {method: 'GET'}).then(
            res => res.json()).then(
            res => this.setState({'moveData': res})
        )
    }

    sortRoomData() {
        let tempTempsList = [];
        let tempLuxList =  [];
        let tempHumidList = [];
        let tempMoveFreqList = [];
        let tempMoveTimeList =  [];
        let tempEpochList =  [];


        let filterLow = this.state.date1.getTime();
        let filterHigh= this.state.date2.getTime();

        this.state.roomData.forEach((dataSet) => {

            if ((dataSet["epoch"] * 1000) > filterLow && (dataSet["epoch"] *1000) < filterHigh){
                let date = new Date(dataSet["epoch"] * 1000);


                tempTempsList.push(dataSet["temperature"]);
                tempHumidList.push(dataSet["humidity"]);
                tempLuxList.push(dataSet["lux"]);
                tempEpochList.push(date.toLocaleTimeString());
            }

        });

        this.state.moveData.forEach((dataSet) => {
            if ((dataSet["epoch"] * 1000) > filterLow && (dataSet["epoch"] *1000) < filterHigh) {
                let date = new Date(dataSet["epoch"] * 1000);

                tempMoveFreqList.push(1);
                tempMoveTimeList.push(date.toLocaleTimeString());

            }
        });

        this.temps = tempTempsList;
        this.timePoints = tempEpochList;
        this.humid = tempHumidList;
        this.lux = tempLuxList;
        this.moveFreq = tempMoveFreqList;
        this.moveTime = tempMoveTimeList;
    }


    humidchartRef = React.createRef();
    lightchartRef = React.createRef();
    movechartRef = React.createRef();
    tempchartRef = React.createRef();


    //loading graphs on once the component has been loaded
    componentDidMount() {
        this.buildHumidChart();
        this.buildLightChart();
        this.buildMoveChart();
        this.buildTempChart();

        this.getData("kitchen");
        this.getMovement("kitchen");
    }

    //loading updated graphs after the dataset has been changed
    componentDidUpdate(prevProps, prevState, snapshot) {
        this.buildHumidChart();
        this.buildLightChart();
        this.buildMoveChart();
        this.buildTempChart();
    }

    buildHumidChart = () => {
        const humidchartRef = this.humidchartRef.current.getContext("2d");

        new Chart(humidchartRef, {
            type: "line",
            data: {
                //Bring in data
                labels: this.timePoints,
                datasets: [
                    {
                        label: "Humidity (%)",
                        data: this.humid,
                        fill: false,
                        borderColor: "#ff9100"
                    }
                ]
            },
            options: {
                legend: {
                    labels: {
                        // This more specific font property overrides the global property
                        defaultFontFamily: 'Calisto MT'
                    }
                },
                title: {
                    display: true,
                    text: 'Kitchen Humidity'
                },
                tooltips: {
                    displayColors: false
                },
                layout: {
                    padding: {
                        top: 5,
                        left: 15,
                        right: 15,
                        bottom: 15
                    }
                }
            }
        });
    };

    buildLightChart = () => {
        const lightchartRef = this.lightchartRef.current.getContext("2d");

        new Chart(lightchartRef, {
            type: "line",
            data: {
                //Bring in data
                labels: this.timePoints,
                datasets: [
                    {
                        label: "Light (Lux)",
                        data: this.lux,
                        fill: false,
                        borderColor: "#ff9100"
                    }
                ]
            },
            options: {
                legend: {
                    labels: {
                        // This more specific font property overrides the global property
                        defaultFontFamily: 'Calisto MT'
                    }
                },
                title: {
                    display: true,
                    text: 'Kitchen Light Levels'
                },
                tooltips: {
                    displayColors: false
                },
                layout: {
                    padding: {
                        top: 5,
                        left: 15,
                        right: 15,
                        bottom: 15
                    }
                }
            }
        });
    };

    buildMoveChart = () => {
        const movechartRef = this.movechartRef.current.getContext("2d");

        new Chart(movechartRef, {
            type: "line",
            data: {
                //Bring in data
                labels: this.moveTime,
                datasets: [
                    {
                        label: "Movement",
                        data: this.moveFreq,
                        fill: false,
                        borderColor: "#ff9100"
                    }
                ]
            },
            options: {
                legend: {
                    labels: {
                        // This more specific font property overrides the global property
                        defaultFontFamily: 'Calisto MT'
                    }
                },
                title: {
                    display: true,
                    text: 'Kitchen Movement'
                },
                tooltips: {
                    displayColors: false
                },
                layout: {
                    padding: {
                        top: 5,
                        left: 15,
                        right: 15,
                        bottom: 15
                    }
                }
            }
        });
    };

    buildTempChart = () => {
        const tempchartRef = this.tempchartRef.current.getContext("2d");

        new Chart(tempchartRef, {
            type: "line",
            data: {
                //Bring in data
                labels: this.timePoints,
                datasets: [
                    {
                        label: "Temperature (Celsius)",
                        data: this.temps,
                        fill: false,
                        borderColor: "#ff9100"
                    }
                ]
            },
            options: {
                legend: {
                    labels: {
                        // This more specific font property overrides the global property
                        defaultFontFamily: 'Calisto MT'
                    }
                },
                title: {
                    display: true,
                    text: 'Kitchen Temperature'
                },
                tooltips: {
                    displayColors: false
                },
                layout: {
                    padding: {
                        top: 5,
                        left: 15,
                        right: 15,
                        bottom: 15
                    }
                }
            }
        });
    };

    onChange1 = date1 => this.setState({ date1 });
    onChange2 = date2 => this.setState({ date2 });

    render() {
        this.sortRoomData();
        return (
            <Container>
                <br></br>
                <h1 className="statTitle">Kitchen Statistics</h1>
                <Row>
                    <Col>
                        <canvas
                            id="kitchenHumidChart"
                            ref={this.humidchartRef}
                        />
                    </Col>
                    <Col>
                        <canvas
                            id="kitchenLightChart"
                            ref={this.lightchartRef}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <canvas
                            id="kitchenMoveChart"
                            ref={this.movechartRef}
                        />
                    </Col>
                    <Col>
                        <canvas
                            id="kitchenTempChart"
                            ref={this.tempchartRef}
                        />
                    </Col>
                </Row>
                <Row>
                    Please choose two dates/times that you want to filter between:
                    <Col>
                        <div>
                            <DateTimePicker className="Pickers"
                                            onChange={this.onChange1}
                                            value={new Date(this.state.date1)}
                            />
                            <a>   And   </a>
                            <DateTimePicker className="Pickers"
                                            onChange={this.onChange2}
                                            value={new Date(this.state.date2)}
                            />
                        </div>
                    </Col>
                </Row>
                <br></br>
                <br></br>
            </Container>

        )
    }


}

export default KitchenCharts;