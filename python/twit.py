import twitter
#import pyttsx3
from google.cloud import texttospeech
import subprocess
import time
#engine = pyttsx3.init()
tweets_read = []

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

api = twitter.Api(consumer_key="hLfet4C3rtlulTuElzhCuCT35",
                  consumer_secret="deq5rvkoCoLNziaWFMLGMa7PCiahzyrh9MSnxY8pdBHyq4VHJO",
                  access_token_key="1069035230-qX5YmPmR14ko191X8YLiKuyLz6yOPV0akiMQdrr",
                  access_token_secret="XsqhXwudGdP7F72iUmGY9l2FCbYspyC1FsDS3oOzlmSAc")

while True:
    try:
        tweets = api.GetSearch(term="#friday", lang="en", count=100, return_json=True, since_id=tweets_read[0])
    except IndexError:
        tweets = api.GetSearch(term="#friday", lang="en", count=1, return_json=True)
    reading = True
    for tweet in tweets["statuses"]:
        if reading:
            if tweet['id'] not in tweets_read:
                text = api.GetStatus(tweet['id']).text
                if text[0:2] != "RT":
                    print(text)
                    play_text(text.split("https")[0])
                    tweets_read.append(tweet['id'])
                    reading = False

    time.sleep(20)
        
