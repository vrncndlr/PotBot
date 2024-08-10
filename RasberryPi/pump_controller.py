from error_handler import handle_errors
import json
import time
import os
import arduino_manager
import utils

try:
    abspath = os.path.dirname(os.path.abspath(__file__))
    os.chdir(abspath)
except Exception as error:
    handle_errors("pump_controller_error.log", error)


def manual(data, database):
    if data["water"] == 1:
        measurements = json.load(open("last_measurement.json"))
        measurements = list(measurements.values())[0]
        if measurements["soilMoisture"] < data["soil_moisture"]:
            arduino_manager.turn_on_water_pump(data["amount"])
            print("Turned on water pump")
        data["water"] = 0
        file = open("settings.json", "w")
        print(f"Data dumping: {data}")
        json.dump(data, file)
        file.close()

        database.push_data(
            f"/users/{database.uid}/plants/{database.plant_id}",
            "settings",
            {"water": 0},
        )


def automatic(data):
    if utils.should_plant_be_watered(1):
        measurements = json.load(open("last_measurement.json"))
        measurements = list(measurements.values())[0]
        if measurements["soilMoisture"] < data["soil_moisture"]:
            arduino_manager.turn_on_water_pump(data["amount"])
            print("Turned on water pump")


def frequency(data):
    if utils.should_plant_be_watered(data["frequency"]):
        arduino_manager.turn_on_water_pump(data["amount"])
        print("Turned on water pump")


def run(database):
    print("pump_controller")
    if not utils.check_if_file_exist_and_is_not_empty("settings.json"):
        return None

    while True:
        time.sleep(5)
        file = open("settings.json", "r")
        data = json.load(file)
        file.close()
        print(f"Settings json: {data}")
        if data["type"] == "Manual":
            manual(data, database)
        elif data["type"] == "Automatic":
            automatic(data)
        elif data["type"] == "Scheduled":
            frequency(data)
        else:
            print("Incorrect type. Check the settings.")
