from time import sleep
import multiprocessing
import os
import subprocess
import sys
import website
import error_handler
from threading import Thread
import main_controller
import gui_setup

abspath = os.path.dirname(os.path.abspath(__file__))
os.chdir(abspath)


class Bool:
    def __init__(self):
        self.bool = False


def connect_to_network():
    with open("networkUserAndPassword.txt", "r") as credentials:
        ssid = credentials.readline().strip()
        pass_ = credentials.readline().strip()
        subprocess.run(["sudo", "nmcli", "device", "disconnect", "wlan0"])
        sleep(5)
        subprocess.run(
            ["sudo", "nmcli", "device", "wifi", "list"],
            stdout=subprocess.PIPE,
            text=True,
        )
        for i in range(3):
            output = subprocess.run(
                ["sudo", "nmcli", "device", "wifi", "connect", ssid, "password", pass_],
                stderr=subprocess.PIPE,
                text=True,
            )
            if "Error: No network with SSID" in output.stderr:
                sleep(0.1)
                continue
            else:
                sleep(30)
                # themain = Thread(target=main_controller.run)
                # themain.start()
                # themain.join()
                subprocess.run(["sudo", "python", "main_controller.py"])
                return True

    # remove wifi credentials
    os.remove("networkUserAndPassword.txt")
    return False


def enable_hotspot():
    subprocess.run(["sudo", "nmcli", "connection", "up", "Hotspot"])
    website.start_website()


def wait_for_user_wifi():
    while not os.path.exists("networkUserAndPassword.txt"):
        sleep(0.5)


def _main():
    object = None
    while True:
        if not os.path.exists("networkUserAndPassword.txt"):
            try:
                object = Bool()
                Thread(target=gui_setup.run, args=(object,)).start()
                enable_hotspot()
            except Exception as error:
                print("something went wrong")
                error_handler.handle_errors("hotspot_manager_error.log", error)

        if os.path.exists("networkUserAndPassword.txt") and connect_to_network():
            if object:
                object.bool = True
            break


if __name__ == "__main__":
    _main()
