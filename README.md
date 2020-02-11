## Installation
There are 3 elements that need to be running for the device to function; the raspberry pi python code, node js server and the react frontend.

### Node Server
- Make sure you have the latest version of Node js and npm installed.
- Open the [/node_server](node server) directory in a terminal.
- Run `npm install` followed by `npm start`.
- The server will start with a default port of 3001.

### React
- Open the [/react/corduroy](react) directory in a terminal.
- Run `serve -s build`, the port will be displayed.

### Python
- Create a new virtual python environment using pyenv on your raspberry pi with version 3.8.0+ of python (pyenv virtualenv 3.8.0 envName).
- From the [/python](python) directory in the repository, copy all of the files into your virtual environment.
- Run `pip install -r requirements.txt`.
- Set an environmental variable called `GOOGLE_APPLICATION_CREDENTIALS` as the IOT.json file found in the python directory.
- Edit the main.py file to include the correct address for your node server.
- Run both the main.py file and twit.py file in python.

### Sensor Placement
- Bind the sensors to the zwave receiver connected to the pi and find out their node numbers.
- Place the sensors in required locations and assign them the relevant names in the main.py file sensor_names variable using their node ids as reference.

## Networking

Raspberry Pi to Node Server
POST '/data/update'
JSON {
    data_sets : [
        {
            data : [
                {
                    sensor_name : <sensor name>,
                    temperature : <temp>,
                    humidity : <humidity>,
                    lux : <luminance>,
                    ultraviolet : <uv>
                },
                {
                    ...
                }
            ],
            epoch : <epoch>
        },
        {
            ...
        }
    ],
    pi : <pi id>
}

POST '/data/movement'
JSON {
    sensor_name : <sensor name>,
    epoch : <epoch>
    pi : <pi id>
}