from error_handler import handle_errors
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import json
import time
import os
import utils


def _set_user_email(event):
    data = event.data
    with open("email.id", "w") as file:
        file.write(data)


def _set_user_notification_setting(event):
    data = event.data
    with open("notify.set", "w") as file:
        file.write(f"{data}")


def _set_settings(event):
    key = event.path.replace("/", "")
    with open("settings.json", "r") as file:
        settings = json.load(file)
    if key == "":
        settings.update(event.data)
    else:
        settings[key] = event.data
    with open("settings.json", "w") as file:
        json.dump(settings, file)


class DatabaseManager:
    def __init__(self):
        self.abspath = os.path.dirname(os.path.abspath(__file__))
        os.chdir(self.abspath)
        self.cred = None
        self.uid = None
        self.plant_id = None
        self.email_listener = None
        self.notif_settings_listener = None
        self.settings_listener = None
        self.cred = credentials.Certificate(
            "/home/pi/PotBot/RasberryPi/firebase-key.json"
        )
        firebase_admin.initialize_app(
            self.cred,
            {
                "databaseURL": "https://potbot-9f9ff-default-rtdb.europe-west1.firebasedatabase.app/"
            },
            name="main",
        )

        try:
            with open("user.id", "r") as uid_file:
                self.uid = uid_file.readline().strip()
            with open("plant.id", "r") as plant_id_file:
                self.plant_id = plant_id_file.readline().strip()
            self.setupComplete = True
        except Exception as error:
            handle_errors("database_manager_error.log", error)

    def push_data(self, path, child, data):
        ref = db.reference(path)
        ref.child(child).update(data)

    def read_json(self, filepath):
        if not utils.check_if_file_exist_and_is_not_empty(filepath):
            time.sleep(5)
            return None

        with open(filepath) as file:
            data = json.load(file)

        if self.uid and self.plant_id:
            self.push_data(f"/users/{self.uid}/plants/{self.plant_id}", "measureData", data)

    def run(self):
        print("database_manager.run()")
        try:
            self.email_listener = db.reference(f"/users/{self.uid}/email").listen(
                _set_user_email
            )
            self.notif_settings_listener = db.reference(
                f"/users/{self.uid}/notificationSettings/notificationToggle"
            ).listen(_set_user_notification_setting)
            self.settings_listener = db.reference(
                f"/users/{self.uid}/plants/{self.plant_id}/settings"
            ).listen(_set_settings)

            while True:
                self.read_json("last_measurement.json")
                time.sleep(60)
        except Exception as error:
            handle_errors("database_manager_error.log", error)

    def reference(self, arg):
        ref = db.reference(arg)
        return ref
