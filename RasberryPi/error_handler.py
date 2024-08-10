from datetime import datetime
from traceback import format_exc
import utils


def handle_errors(log_file, error):
    logfile = open(log_file, "a")
    logfile.write(datetime.now().strftime("%Y-%m-%d %H:%M:%S: "))
    logfile.write(str(error))
    logfile.write(f"\n{format_exc()}")
    logfile.close()
