import React, { Component } from 'react';
import HumidityCharts from "./HumidityCharts";
import LightCharts from "./LightCharts";
import MovementCharts from "./MovementCharts";
import TemperatureCharts from "./TemperatureCharts";
import BathroomCharts from "./BathroomCharts";
import NavBar from "./NavBar";
import {Button, ButtonGroup, Card} from "react-bootstrap";
import BedroomCharts from "./BedroomCharts";
import KitchenCharts from "./KitchenCharts";
import LivingRoomCharts from "./LivingRoomCharts";

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            statChoice: 1,
            roomChoice: 0,
            username: this.props.username
        };
    }

    statBar = (

        <div>
            <NavBar/>
            <div className="navSelect">
                <Card>
                    <Card.Body>
                        <Card.Text>
                            Click a button to go see more information for all rooms
                        </Card.Text>
                        <ButtonGroup aria-label="Basic example">

                            <Button className="barButton" onClick={() => this.setState((prevprops, props) => {
                                return {statChoice: 1, roomChoice:0}
                            })} >Humidity</Button>

                            <Button className="barButton" onClick={() => this.setState((prevprops, props) => {
                                return {statChoice: 2, roomChoice:0}
                            })} >Light</Button>

                            <Button className="barButton" onClick={() => this.setState((prevprops, props) => {
                                return {statChoice: 3, roomChoice:0}
                            })} >Movement</Button>

                            <Button className="barButton" onClick={() => this.setState((prevprops, props) => {
                                return {statChoice: 4, roomChoice:0}
                            })} >Temperature</Button>

                        </ButtonGroup>
                    </Card.Body>
                </Card>
            </div>
        </div>);

    roomBar = (
        <div>
            <div className="navSelect">
                <Card>
                    <Card.Body>
                        <Card.Text>
                            Click a room button to go see more information about it
                        </Card.Text>
                        <ButtonGroup aria-label="Basic example">

                            <Button className="barButton" onClick={() => this.setState((prevprops, props) => {
                                return {roomChoice: 1}
                            })} >Bedroom</Button>

                            <Button className="barButton" onClick={() => this.setState((prevprops, props) => {
                                return {roomChoice: 2}
                            })} >Bathroom</Button>

                            <Button className="barButton" onClick={() => this.setState((prevprops, props) => {
                                return {roomChoice: 3}
                            })} >Kitchen</Button>

                            <Button className="barButton" onClick={() => this.setState((prevprops, props) => {
                                return {roomChoice: 4}
                            })} >Living Room</Button>

                        </ButtonGroup>
                    </Card.Body>
                </Card>
            </div>
        </div>);

    render() {
        if (this.state.roomChoice === 0) {
            if (this.state.statChoice === 1) {
                return (

                    <div>
                        {this.statBar}
                        <HumidityCharts/>
                        {this.roomBar}
                    </div>
                )
            } else if (this.state.statChoice === 2) {
                return (

                    <div>
                        {this.statBar}
                        <LightCharts/>
                        {this.roomBar}
                    </div>
                )
            } else if (this.state.statChoice === 3) {
                return (

                    <div>
                        {this.statBar}
                        <MovementCharts/>
                        {this.roomBar}
                    </div>
                )
            } else {
                return (

                    <div>
                        {this.statBar}
                        <TemperatureCharts/>
                        {this.roomBar}
                    </div>
                )
            }
        } else if (this.state.roomChoice === 1){
            return (
                <div>
                    {this.statBar}
                    <BedroomCharts/>
                    {this.roomBar}
                </div>
            )
        } else if (this.state.roomChoice === 2){
            return (
                <div>
                    {this.statBar}
                    <BathroomCharts/>
                    {this.roomBar}
                </div>
            )
        } else if (this.state.roomChoice === 3){
            return (
                <div>
                    {this.statBar}
                    <KitchenCharts/>
                    {this.roomBar}
                </div>
            )
        } else {
            return (
                <div>
                    {this.statBar}
                    <LivingRoomCharts graphData = {this.roomData}/>
                    {this.roomBar}
                </div>
            )
        }
    }
}

export default Dashboard;