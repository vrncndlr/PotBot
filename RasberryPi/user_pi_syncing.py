from error_handler import handle_errors
from time import sleep
import os

dbman = None
product_id = None
is_linked = None
connection_state_listener = None

try:
    from firebase_admin import db
    from firebase_admin import credentials
    from firebase_admin import initialize_app
    abspath = os.path.dirname(os.path.abspath(__file__))
    os.chdir(abspath)

    initialize_app(
        credentials.Certificate("/home/pi/PotBot/RasberryPi/firebase-key.json"),
        {
            "databaseURL": "https://potbot-9f9ff-default-rtdb.europe-west1.firebasedatabase.app/"
        },
    )
    with open("product.id", "r") as product_id_file:
        product_id = product_id_file.readline().strip()
except Exception as error:
    handle_errors("user_pi_syncing_error.log", error)

def is_linked_with_user():
    try:
        with open("user.id", "r") as user_id_file:
            uid = user_id_file.readline().strip()
        with open("plant.id", "r") as plant_name_file:
            plant_name = plant_name_file.readline().strip()
    except Exception:
        return False

    try:
        ref = db.reference(f"/users/{uid}/plants/{plant_name}")
        return ref.child("productID").get() == product_id
    except Exception as error:
        handle_errors("user_pi_syncing_error.log", error)
        return False
    
def _link_pi_with_user_setup():
    global is_linked
    is_linked = False
    db.reference(f"/potbots").update({product_id: ""})
    dbman.uid = None
    dbman.plant_id = None
    with open("user.id", "w") as user_id_file:
        user_id_file.write("None")
    with open("plant.id", "w") as plant_name_file:
        plant_name_file.write("None")

def _link_pi_with_user(event):
    print("-----_link_pi_with_user called-----")
    global is_linked, connection_state_listener
    if is_linked:
        return

    data = event.data
    print(f"-----data received: {data}-----")
    if data == None or data == "" or data == "RaspberryPi":
        return

    dbman.uid = data["uid"]
    user_id_file = open("user.id", "w")
    user_id_file.write(dbman.uid)
    user_id_file.close()

    dbman.plant_id = data["plant"]
    plant_file = open("plant.id", "w")
    plant_file.write(dbman.plant_id)
    plant_file.close()
    
    db.reference(f"/users/{dbman.uid}/plants/{dbman.plant_id}").update({"productID": product_id})
    db.reference(f"/potbots/{product_id}").delete()
    is_linked = True

    if connection_state_listener != None:
        connection_state_listener.close()
    connection_state_listener = db.reference(f"/users/{dbman.uid}/plants/{dbman.plant_id}/productID").listen(
                                _connection_state_changed)

def _connection_state_changed(event):
    print("Connection state changed, callback has been called")
    if event.data == None or event.data == "RaspberryPi":
        _link_pi_with_user_setup()

def run(database):
    global dbman, connection_state_listener, is_linked
    try:
        dbman = database
        db.reference(f"/potbots/{product_id}").listen(_link_pi_with_user)
        is_linked = is_linked_with_user()
        if not is_linked:
            print("not linked")
            _link_pi_with_user_setup()
            while not is_linked:
                sleep(5)
            return

        connection_state_listener = db.reference(f"/users/{dbman.uid}/plants/{dbman.plant_id}/productID").listen(
                                _connection_state_changed)
    except Exception as error:
        handle_errors("user_pi_syncing_error.log", error)


if __name__ == "__main__":
    run()
