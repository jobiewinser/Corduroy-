import React, { Component } from 'react';
import {Container, Col, Row} from 'react-bootstrap';
import DateTimePicker from "react-datetime-picker";


var Chart = require('chart.js');

Chart.defaults.global.responsive = true;


class LightCharts extends Component{
    constructor(props) {
        super(props);
        this.state = {
            date1: new Date(new Date() - 86400000),
            date2: new Date(),
            bedData: [],
            bathData: [],
            kitchenData: [],
            loungeData: []
        };

        this.bedLux = [];
        this.loungeLux = [];
        this.kitchenLux = [];
        this.bathLux = [];
        this.timePoints = [];


        this.getData = this.getData.bind(this);
    }

    getData(roomName) {
        if (roomName === "bedroom") {
            fetch("/data/graph?room=" + roomName, {method: 'GET'}).then(
                res => res.json()).then(
                res => this.setState({'bedData': res})
            )
        }
        if (roomName === "bathroom") {
            fetch("/data/graph?room=" + roomName, {method: 'GET'}).then(
                res => res.json()).then(
                res => this.setState({'bathData': res})
            )
        }
        if (roomName === "lounge") {
            fetch("/data/graph?room=" + roomName, {method: 'GET'}).then(
                res => res.json()).then(
                res => this.setState({'loungeData': res})
            )
        }
        if (roomName === "kitchen") {
            fetch("/data/graph?room=" + roomName, {method: 'GET'}).then(
                res => res.json()).then(
                res => this.setState({'kitchenData': res})
            )
        }
    }

    sortRoomData() {
        let tempBedLuxList = [];
        let tempBathLuxList = [];
        let tempKitchenLuxList = [];
        let tempLoungeLuxList = [];
        let tempEpochList =  [];

        let filterLow = this.state.date1.getTime();
        let filterHigh= this.state.date2.getTime();

        this.state.bedData.forEach((dataSet) => {
            if ((dataSet["epoch"] * 1000) > filterLow && (dataSet["epoch"] *1000) < filterHigh) {

                let date = new Date(dataSet["epoch"] * 1000);
                tempBedLuxList.push(dataSet["lux"]);
                tempEpochList.push(date.toLocaleTimeString());
            }
        });
        this.state.bathData.forEach((dataSet) => {
            if ((dataSet["epoch"] * 1000) > filterLow && (dataSet["epoch"] *1000) < filterHigh) {
                tempBathLuxList.push(dataSet["lux"]);
            }
        });
        this.state.loungeData.forEach((dataSet) => {
            if ((dataSet["epoch"] * 1000) > filterLow && (dataSet["epoch"] *1000) < filterHigh) {
                tempLoungeLuxList.push(dataSet["lux"]);
            }
        });
        this.state.kitchenData.forEach((dataSet) => {
            if ((dataSet["epoch"] * 1000) > filterLow && (dataSet["epoch"] *1000) < filterHigh) {
                tempKitchenLuxList.push(dataSet["lux"]);
            }
        });

        this.bedLux = tempBedLuxList;
        this.bathLux = tempBathLuxList;
        this.loungeLux = tempLoungeLuxList;
        this.kitchenLux= tempKitchenLuxList;
        this.timePoints = tempEpochList;
    }

    bedchartRef = React.createRef();
    bathchartRef = React.createRef();
    kitchenchartRef = React.createRef();
    livingchartRef = React.createRef();

    //loading graphs on once the component has been loaded
    componentDidMount() {
        this.buildBedChart();
        this.buildBathChart();
        this.buildKitchenChart();
        this.buildLivingChart();

        this.getData("bedroom");
        this.getData("bathroom");
        this.getData("lounge");
        this.getData("kitchen");
    }

    //loading updated graphs after the dataset has been changed
    componentDidUpdate(prevProps, prevState, snapshot) {
        this.buildBedChart();
        this.buildBathChart();
        this.buildKitchenChart();
        this.buildLivingChart();
    }

    buildBedChart = () => {
        const bedChartRef = this.bedchartRef.current.getContext("2d");

        new Chart(bedChartRef, {
            type: "line",
            data: {
                //Bring in data
                labels: this.timePoints,
                datasets: [
                    {
                        label: "Light (Lux)",
                        data: this.bedLux,
                        fill: false,
                        borderColor: "#ff9100"
                    }
                ]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            max: 250,
                            min: 0
                        }
                    }]
                },
                legend: {
                    labels: {
                        // This more specific font property overrides the global property
                        defaultFontFamily: 'Calisto MT'
                    }
                },
                title: {
                    display: true,
                    text: 'Bedroom Light Levels'
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

    buildBathChart = () => {
        const bathChartRef = this.bathchartRef.current.getContext("2d");

        new Chart(bathChartRef, {
            type: "line",
            data: {
                //Bring in data
                labels: this.timePoints,
                datasets: [
                    {
                        label: "Light (Lux)",
                        data: this.bathLux,
                        fill: false,
                        borderColor: "#ff9100"
                    }
                ]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            max: 250,
                            min: 0
                        }
                    }]
                },
                legend: {
                    labels: {
                        // This more specific font property overrides the global property
                        defaultFontFamily: 'Calisto MT'
                    }
                },
                title: {
                    display: true,
                    text: 'Bathroom Light Levels'
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

    buildKitchenChart = () => {
        const kitchenChartRef = this.kitchenchartRef.current.getContext("2d");

        new Chart(kitchenChartRef, {
            type: "line",
            data: {
                //Bring in data
                labels: this.timePoints,
                datasets: [
                    {
                        label: "Light (Lux)",
                        data: this.kitchenLux,
                        fill: false,
                        borderColor: "#ff9100"
                    }
                ]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            max: 250,
                            min: 0
                        }
                    }]
                },
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

    buildLivingChart = () => {
        const livingChartRef = this.livingchartRef.current.getContext("2d");

        new Chart(livingChartRef, {
            type: "line",
            data: {
                //Bring in data
                labels: this.timePoints,
                datasets: [
                    {
                        label: "Light (Lux)",
                        data: this.loungeLux,
                        fill: false,
                        borderColor: "#ff9100"
                    }
                ]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            max: 250,
                            min: 0
                        }
                    }]
                },
                legend: {
                    labels: {
                        // This more specific font property overrides the global property
                        defaultFontFamily: 'Calisto MT'
                    }
                },
                title: {
                    display: true,
                    text: 'Living Room Light levels'
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
                <h1 className="statTitle">Light Statistics</h1>
                <Row>
                    <Col>
                        <canvas
                            id="bedLightChart"
                            ref={this.bedchartRef}
                        />
                    </Col>
                    <Col>
                        <canvas
                            id="bathLightChart"
                            ref={this.bathchartRef}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <canvas
                            id="kitchenChart"
                            ref={this.kitchenchartRef}
                        />
                    </Col>
                    <Col>
                        <canvas
                            id="livinigChart"
                            ref={this.livingchartRef}
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

export default LightCharts;