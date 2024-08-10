import base64
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email.mime.text import MIMEText
from google.auth.transport.requests import Request
from email import encoders
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

import os
import json
import utils
import database_manager


# Function to create the Gmail API service
def create_gmail_service():
    # Replace 'client_secret.json' with the name of your client secret file
    client_secret_file = "client_secret.json"
    token_file = "token.json"
    SCOPES = [
        "https://www.googleapis.com/auth/gmail.readonly",
        "https://www.googleapis.com/auth/gmail.send",
    ]

    creds = None
    if os.path.exists(token_file):
        with open(token_file, "r") as token:
            creds = Credentials.from_authorized_user_file(token_file, SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(client_secret_file, SCOPES)
            creds = flow.run_local_server(port=0)
            # Save the credentials for future use
        with open(token_file, "w") as token:
            token.write(creds.to_json())

    try:
        service = build("gmail", "v1", credentials=creds)
        return service
    except HttpError as error:
        print(f"An error occurred: {error}")
        return None


# Function to create and send the email
def send_email(service, to, subject, body, attachment=None):
    try:
        message = MIMEMultipart()
        message["to"] = to
        message["subject"] = subject
        message.attach(MIMEText(body, "plain"))

        if attachment:
            with open(attachment, "rb") as f:
                payload = MIMEBase("application", "octate-stream")
                payload.set_payload((f).read())
                encoders.encode_base64(payload)
                payload.add_header(
                    "Content-Disposition", "attachment", filename=attachment
                )
                message.attach(payload)

        create_message = {"raw": base64.urlsafe_b64encode(message.as_bytes()).decode()}
        send_message = (
            service.users().messages().send(userId="me", body=create_message).execute()
        )
        print(f'sent message to {to} Message Id: {send_message["id"]}')
    except HttpError as error:
        print(f"An error occurred: {error}")
        send_message = None
    return send_message


def send_notification(database):
    service = create_gmail_service()
    to = get_email(database)
    subject = "PotBot"
    body = "Please refill water tank. Water level is low."
    attachment = None  # Replace with file path if you want to attach a file
    send_email(service, to, subject, body, attachment)


def get_email(database):
    if not utils.check_if_file_exist_and_is_not_empty("email.id"):
        database.fetch_user_email()
    with open("email.id", "r") as file:
        email = file.readline().strip()
        return email


if __name__ == "__main__":
    service = create_gmail_service()
    to = "wcar@kth.se"
    subject = "PotBot"
    body = "Please refill water tank. Water level is low."
    attachment = None  # Replace with file path if you want to attach a file
    send_email(service, to, subject, body, attachment)
