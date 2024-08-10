import os
import datetime

filepath_timestamp = "latest_time_plant_was_watered.json"


# Checks if a file exist. Check if it is empty. If it is neither, return true.
def check_if_file_exist_and_is_not_empty(filepath=filepath_timestamp):
    if os.path.exists(filepath):
        if os.path.getsize(filepath) != 0:
            return True
        else:
            print("File is empty " + filepath)
            return False
    print("File does not exist " + filepath)
    return False


# Save timestamp to a file
def save_timestamp_to_file(filename=filepath_timestamp):
    with open(filename, "w") as file:
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        file.write(timestamp)


# Get the current timestamp
def get_timestamp():
    return datetime.datetime.now()


# Read timestamp from the file
def read_timestamp_from_file(filename=filepath_timestamp):
    with open(filename, "r") as file:
        timestamp_str = file.read()
        timestamp = datetime.datetime.strptime(timestamp_str, "%Y-%m-%d %H:%M:%S")
        return timestamp


# Calculate the difference between two timestamps in hours
def time_difference_in_hours(timestamp1, timestamp2):
    time_difference = abs(timestamp2 - timestamp1)
    return time_difference.total_seconds() / 3600


# Returns the amount of hours since the plant was last watered
def get_hours_since_plant_was_watered():
    if check_if_file_exist_and_is_not_empty(filepath_timestamp):
        savedTime = read_timestamp_from_file(filepath_timestamp)
        currentTime = get_timestamp()
        return time_difference_in_hours(savedTime, currentTime)
    else:
        return float("inf")

def should_plant_be_watered(interval):
    if check_if_file_exist_and_is_not_empty(
        "latest_time_plant_was_watered.json"                                                      
    ):
        last_time_watered = read_timestamp_from_file(
            "latest_time_plant_was_watered.json"
        )
        current_time = get_timestamp()
        difference = time_difference_in_hours(last_time_watered, current_time)
        if (difference >= interval):
            return True
        else:
            return False
    return True
