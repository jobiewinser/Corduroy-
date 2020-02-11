import React, { Component } from 'react';
import {Container, Col, Row} from 'react-bootstrap';
import DateTimePicker from "react-datetime-picker";


var Chart = require('chart.js');

Chart.defaults.global.responsive = true;


class MovementCharts extends Component{
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

        this.bedMove = [];
        this.loungeMove = [];
        this.kitchenMove = [];
        this.bathMove = [];
        this.timePoints = [];


        this.getMovement = this.getMovement.bind(this);
    }

    getMovement(roomName) {
        if (roomName === "bedroom") {
            fetch("data/moveGraph?room="+roomName, {method: 'GET'}).then(
                res => res.json()).then(
                res => this.setState({'bedData': res})
            )
        }
        if (roomName === "bathroom") {
            fetch("data/moveGraph?room="+roomName, {method: 'GET'}).then(
                res => res.json()).then(
                res => this.setState({'bathData': res})
            )
        }
        if (roomName === "kitchen") {
            fetch("data/moveGraph?room="+roomName, {method: 'GET'}).then(
                res => res.json()).then(
                res => this.setState({'kitchenData': res})
            )
        }
        if (roomName === "lounge") {
            fetch("data/moveGraph?room="+roomName, {method: 'GET'}).then(
                res => res.json()).then(
                res => this.setState({'loungeData': res})
            )
        }
    }

    sortRoomData() {
        let tempBedList = [];
        let tempBathList = [];
        let tempKitchenList = [];
        let tempLoungeList = [];
        let tempEpochList =  [];

        let filterLow = this.state.date1.getTime();
        let filterHigh= this.state.date2.getTime();

        this.state.bedData.forEach((dataSet) => {
            if ((dataSet["epoch"] * 1000) > filterLow && (dataSet["epoch"] *1000) < filterHigh) {
                let date = new Date(dataSet["epoch"] * 1000);

                tempBedList.push("1");
                tempEpochList.push(date.toLocaleTimeString());
            }
        });
        this.state.bathData.forEach((dataSet) => {
            if ((dataSet["epoch"] * 1000) > filterLow && (dataSet["epoch"] *1000) < filterHigh) {
                tempBathList.push("1");
            }
        });
        this.state.loungeData.forEach((dataSet) => {
            if ((dataSet["epoch"] * 1000) > filterLow && (dataSet["epoch"] *1000) < filterHigh) {
                tempLoungeList.push("1");
            }
        });
        this.state.kitchenData.forEach((dataSet) => {
            if ((dataSet["epoch"] * 1000) > filterLow && (dataSet["epoch"] *1000) < filterHigh) {
                tempKitchenList.push("1");
            }
        });

        this.bedMove = tempBedList;
        this.bathMove = tempBathList;
        this.loungeMove = tempLoungeList;
        this.kitchenMove = tempKitchenList;
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

        this.getMovement("bedroom");
        this.getMovement("bathroom");
        this.getMovement("lounge");
        this.getMovement("kitchen");
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
                        label: "Movement",
                        data: this.bedMove,
                        fill: false,
                        borderColor: "#ff9100"
                    }
                ]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            max: 1,
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
                    text: 'Bedroom Movement'
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
                        label: "Movement",
                        data: this.bathMove,
                        fill: false,
                        borderColor: "#ff9100"
                    }
                ]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            max: 1,
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
                    text: 'Bathroom Movement'
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
                        label: "Movement",
                        data: this.kitchenMove,
                        fill: false,
                        borderColor: "#ff9100"
                    }
                ]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            max: 1,
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

    buildLivingChart = () => {
        const livingChartRef = this.livingchartRef.current.getContext("2d");

        new Chart(livingChartRef, {
            type: "line",
            data: {
                //Bring in data
                labels: this.timePoints,
                datasets: [
                    {
                        label: "Movement",
                        data: this.loungeMove,
                        fill: false,
                        borderColor: "#ff9100"
                    }
                ]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            max: 1,
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
                    text: 'Living Room Movement'
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

                <h1 className={"statTitle"}>Movement Statistics</h1>
                <Row>
                    <Col>
                        <canvas
                            id="bedMoveChart"
                            ref={this.bedchartRef}
                        />
                    </Col>
                    <Col>
                        <canvas
                            id="bathMoveChart"
                            ref={this.bathchartRef}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <canvas
                            id="kitchenMoveChart"
                            ref={this.kitchenchartRef}
                        />
                    </Col>
                    <Col>
                        <canvas
                            id="livingMoveChart"
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

export default MovementCharts;