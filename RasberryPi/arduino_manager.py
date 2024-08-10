#!/usr/bin/env python3
from datetime import datetime
from error_handler import handle_errors
from math import floor
import json
import serial
import time
import os
import database_manager
import utils

port = None


def setup():
    abspath = os.path.dirname(os.path.abspath(__file__))
    os.chdir(abspath)

    global port
    port = serial.Serial("/dev/ttyACM0", 115200, timeout=1.0)
    time.sleep(3)


def storemeasurements(measurements):
    measurements[0] = int(measurements[0])
    measurements[1] = float(measurements[1])
    measurements[2] = float(measurements[2])
    measurements[3] = int(measurements[3])

    dictionary = {
        f"{floor(datetime.now().timestamp())}": {
            "dateTime": f'{datetime.now().strftime("%Y-%m-%d %H:%M:%S")}',
            "waterLevel": measurements[0],
            "temperature": measurements[1],
            "uvIntensity": measurements[2],
            "soilMoisture": measurements[3],
        }
    }

    with open("last_measurement.json", "w") as file:
        json.dump(dictionary, file)


def turn_on_water_pump(ml):
    if port is None:
        setup()
    message = str(ml) + "\n"
    port.write(message.encode())

    utils.save_timestamp_to_file("latest_time_plant_was_watered.json")


def check_for_messages():
    if port is None:
        setup()
    port.reset_input_buffer()
    print("Serial OK")

    try:
        measurements = []
        while True:
            time.sleep(1)
            while port.in_waiting <= 0:
                time.sleep(3)
            arduino_data = port.readline().decode("utf-8").rstrip()
            if arduino_data:
                print(f"{arduino_data}")
                measurements = arduino_data.split(" ")
            storemeasurements(measurements)
    except KeyboardInterrupt:
        print("Closing Serial Communication")
        port.close()

    # Print runtime exceptions to a log file
    except Exception as error:
        handle_errors("arduino_manager_error.log", error)
