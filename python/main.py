import logging
import sys, os
from google.cloud import texttospeech

logging.basicConfig(level=logging.INFO)

logger = logging.getLogger('openzwave')

import openzwave
from openzwave.node import ZWaveNode
from openzwave.value import ZWaveValue
from openzwave.scene import ZWaveScene
from openzwave.controller import ZWaveController
from openzwave.network import ZWaveNetwork
from openzwave.option import ZWaveOption
import time
import six
if six.PY3:
    from pydispatch import dispatcher
else:
    from louie import dispatcher
import time
import datetime
from pprint import pprint
import urllib.request
import json
import subprocess

pi_id = 1
device="/dev/ttyACM0"
log="None"
sniff=300.0
sensor_names = {4 : "lounge", 5 : "bathroom"}
server_url = "http://5b07a9da.ngrok.io"
unsent_data = {"data_sets" : [], "pi" : pi_id}

options = ZWaveOption(device)
options.set_log_file("OZW_Log.log")
options.set_append_log_file(False)
options.set_console_output(False)
options.set_save_log_level(log)
options.set_logging(True)
options.lock()

def play_text(text):
    # Instantiates a client
    client = texttospeech.TextToSpeechClient()

    # Set the text input to be synthesized
    synthesis_input = texttospeech.types.SynthesisInput(text=text)

    # Build the voice request, select the language code ("en-US") and the ssml
    # voice gender ("neutral")
    voice = texttospeech.types.VoiceSelectionParams(
        language_code='en-US',
        ssml_gender=texttospeech.enums.SsmlVoiceGender.NEUTRAL)

    # Select the type of audio file you want returned
    audio_config = texttospeech.types.AudioConfig(
        audio_encoding=texttospeech.enums.AudioEncoding.MP3)

    # Perform the text-to-speech request on the text input with the selected
    # voice parameters and audio file type
    response = client.synthesize_speech(synthesis_input, voice, audio_config)

    # The response's audio_content is binary.
    with open('output.mp3', 'wb') as out:
        # Write the response to the output file.
        out.write(response.audio_content)

    omxprocess = subprocess.Popen(['omxplayer', "-o", "hdmi", "--vol", "900", "output.mp3"], stdin=subprocess.PIPE)

    time.sleep(1)
    omxprocess.stdin.write('q'.encode())

def louie_network_started(network):
    print('//////////// ZWave network is started ////////////')
    print('Louie signal : OpenZWave network is started : homeid {:08x} - {} nodes were found.'.format(network.home_id, network.nodes_count))

def louie_network_resetted(network):
    print('Louie signal : OpenZWave network is resetted.')

def louie_network_ready(network):
    print('//////////// ZWave network is ready ////////////')
    print('Louie signal : ZWave network is ready : {} nodes were found.'.format(network.nodes_count))
    print('Louie signal : Controller : {}'.format(network.controller))
    dispatcher.connect(louie_value_update, ZWaveNetwork.SIGNAL_VALUE)
    
def louie_value_update(network, node, value):
    if value.label == "Burglar":
        print("Movement Detected")
        post_movement(server_url, sensor_names[node.node_id], pi_id)
        for light_node in network.nodes:
            if light_node == node.node_id:
                for val in network.nodes[light_node].get_sensors():
                    if network.nodes[light_node].values[val].units == 'lux':
                        if network.nodes[light_node].get_sensor_value(val) < 10:
                            play_text("Are you ok?")
        
def post_sensor_data(server_url, pi_id):
    global unsent_data
    req = urllib.request.Request(server_url + "/data/update")
    req.add_header('Content-Type', 'application/json; charset=utf-8')
    jsondata = json.dumps(unsent_data)
    jsondataasbytes = jsondata.encode('utf-8')
    req.add_header('Content-Length', len(jsondataasbytes))
    try:
        response = urllib.request.urlopen(req, jsondataasbytes)
        result = json.loads(response.read().decode())["success"]
        if result:
            print("sensor data sent")
            unsent_data = {"data_sets" : [], "pi" : pi_id}
        else:
            print("unknown POST error")
        
    except urllib.error.HTTPError:
        print("Invalid url")

def post_movement(server_url, sensor_name, pi_id):
    req = urllib.request.Request(server_url + "/data/movement")
    req.add_header('Content-Type', 'application/json; charset=utf-8')
    body = {"sensor_name" : sensor_name, "epoch" : datetime.datetime.now().timestamp(), "pi" : pi_id}
    jsondata = json.dumps(body)
    jsondataasbytes = jsondata.encode('utf-8')
    req.add_header('Content-Length', len(jsondataasbytes))
    try:
        response = urllib.request.urlopen(req, jsondataasbytes)
        result = json.loads(response.read().decode())["success"]
        if result:
            print("movement sent")
        else:
            print("unknown post error")
    except urllib.error.HTTPError:
        print("Invalid url")

#Create a network object
network = ZWaveNetwork(options, log=None)

dispatcher.connect(louie_network_started, ZWaveNetwork.SIGNAL_NETWORK_STARTED)
dispatcher.connect(louie_network_resetted, ZWaveNetwork.SIGNAL_NETWORK_RESETTED)
dispatcher.connect(louie_network_ready, ZWaveNetwork.SIGNAL_NETWORK_READY)

print("------------------------------------------------------------")
print("Waiting for driver : ")
print("------------------------------------------------------------")
for i in range(0,300):
    if network.state>=network.STATE_STARTED:
        print(" done")
        break
    else:
        sys.stdout.write(".")
        sys.stdout.flush()
        time.sleep(1.0)
if network.state<network.STATE_STARTED:
    print(".")
    print("Can't initialise driver! Look at the logs in OZW_Log.log")
    quit(1)
print("------------------------------------------------------------")
print("Use openzwave library : {}".format(network.controller.ozw_library_version))
print("Use python library : {}".format(network.controller.python_library_version))
print("Use ZWave library : {}".format(network.controller.library_description))
print("Network home id : {}".format(network.home_id_str))
print("Controller node id : {}".format(network.controller.node.node_id))
print("Controller node version : {}".format(network.controller.node.version))
print("Nodes in network : {}".format(network.nodes_count))
print("------------------------------------------------------------")
print("Waiting for network to become ready : ")
print("------------------------------------------------------------")
for i in range(0,300):
    if network.state>=network.STATE_READY:
        print(" done")
        break
    else:
        sys.stdout.write(".")
        #sys.stdout.write(network.state_str)
        #sys.stdout.write("(")
        #sys.stdout.write(str(network.nodes_count))
        #sys.stdout.write(")")
        #sys.stdout.write(".")
        sys.stdout.flush()
        time.sleep(1.0)
if not network.is_ready:
    print(".")
    print("Can't start network! Look at the logs in OZW_Log.log")
    quit(2)


time.sleep(1.0)
network.controller.node.name = "Corduroy"

while True:
    data_set = []
    for node in network.nodes:
        if node in [4, 5]:
            network.nodes[node].request_state()
            time.sleep(10.0)
            data_set.append({"sensor_name":sensor_names[node]})
            for val in network.nodes[node].get_sensors():
                if network.nodes[node].values[val].units == '':
                    data_set[-1]["ultraviolet"] = network.nodes[node].get_sensor_value(val)
                elif network.nodes[node].values[val].units == '%':
                    data_set[-1]["humidity"] = network.nodes[node].get_sensor_value(val)
                elif network.nodes[node].values[val].units == 'C':
                    data_set[-1]["temperature"] = network.nodes[node].get_sensor_value(val)
                elif network.nodes[node].values[val].units == 'F':
                    data_set[-1]["temperature"] = (network.nodes[node].get_sensor_value(val) - 32) * 5 / 9
                elif network.nodes[node].values[val].units == 'lux':
                    data_set[-1]["lux"] = network.nodes[node].get_sensor_value(val)
    unsent_data["data_sets"].append({"epoch" : datetime.datetime.now().timestamp(), "data" : data_set})
    pprint(unsent_data)
    if len(unsent_data["data_sets"]) > 0:
        post_sensor_data(server_url, pi_id)
    if data_set[-1]["temperature"] < 19:
        play_text("It is getting cold in here, consider turning up the heating.")
        
    time.sleep(40.0)

network.stop()

