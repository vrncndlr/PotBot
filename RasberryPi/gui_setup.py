from tkinter import *
from tkinter import ttk
import os
import subprocess
import error_handler
import time
from threading import Thread


class Bool:
    def __init__(self):
        self.bool = False


def create_window():
    os.environ["DISPLAY"] = ":0.0"
    try:
        subprocess.run(
            ["sudo", "xhost", "+SI:localuser:root"],
            check=True,
            text=True,
            capture_output=True,
        )
    except Exception as error:
        error_handler.handle_errors("gui.log", error)
    bg_color = "#94C973"
    fg_color = "#000209"

    window = Tk()
    window.attributes("-fullscreen", True)
    window.title("PotBot")
    window.configure(bg=bg_color, cursor="none")

    style = ttk.Style()
    style.configure("TFrame", background=bg_color)

    frame = ttk.Frame(window, padding=10, style="TFrame")
    frame.grid()

    myfont = ("Times New Roman", 15, "bold")

    label_text = "1. Connect to the PotBot network.\n2. Open pot.bot in your browser.\n3. Then enter your WiFi name and password."

    label = Label(frame, text=label_text, font=myfont, bg=bg_color, fg=fg_color)
    label.grid(column=0, row=0, pady=5, padx=(0, 10), sticky="w")

    # ttk.Button(frame, text="Quit", command=window.destroy).grid(
    #    column=0, row=1, pady=10
    # )

    # Centering the frame on the window
    frame.update_idletasks()
    frm_width = frame.winfo_width()
    frm_height = frame.winfo_height()
    window_width = 480
    window_height = 320
    x_offset = (window_width - frm_width) // 2
    y_offset = (window_height - frm_height) // 2

    frame.place(x=x_offset, y=y_offset)

    return window


def check_destroy(object, window):
    if object.bool:
        window.destroy()
    else:
        window.after(1000, check_destroy, object, window)


def run(object):
    window = create_window()
    window.after(1000, check_destroy, object, window)
    window.mainloop()


def shutdown(object):
    time.sleep(4)
    object.bool = True


if __name__ == "__main__":
    object = Bool()
    window = create_window()
    window.after(1000, check_destroy, object, window)
    Thread(target=shutdown, args=(object,)).start()
    window.mainloop()
