import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
import os
from dotenv import load_dotenv

load_dotenv()

class EmailService:

    smtp_server = os.getenv('smtp_server')
    smtp_port = os.getenv('smpt_port')
    smtp_username = os.getenv('smtp_username')
    smtp_password = os.getenv('smtp_password')
    
    sender_email = "packtracker@example.com"
    subject = "Actualización de estado de tu paquete"
    

    def load_content(receiver_name, pack_id, current_status, tracking_link):
        content = f"""
        <!DOCTYPE html>
        <html>
            <head>
                <title>Actualización de estado de tu paquete</title>
            </head>
        <body>
            <h1>Actualización de estado de tu paquete</h1>

            <p>Estimado/a <strong>{receiver_name}</strong>,</p>

            <p>Te informamos que el paquete con el número de seguimiento <strong>{pack_id}</strong> ha sido registrado y su estado se ha actualizado.</p>

            <p>Estado Actual del Paquete: <strong>{current_status}</strong></p>

            <p>Puedes seguir el progreso de tu paquete haciendo clic en el siguiente enlace:</p>
            <p><a href="{tracking_link}">Ver seguimiento del paquete</a></p>

            <p>Gracias por confiar en nuestro servicio de envío. Si tienes alguna pregunta o necesitas ayuda adicional, no dudes en ponerte en contacto con nuestro equipo de soporte.</p>

            <p>Atentamente,</p>
            <p>Pack Tracker</p>
        </body>
        </html>
    """
        return content


    def form_message(content, receiver_email):
        message = MIMEMultipart()
        message["From"] = EmailService.sender_email
        message["To"] = receiver_email
        message["Subject"] = EmailService.subject
        html_body = MIMEText(content, "html")
        message.attach(html_body)

        return message
    

    def notify(message, receiver_email):
        try:
            with smtplib.SMTP(EmailService.smtp_server, EmailService.smtp_port) as server:
                server.starttls() 
                server.login(EmailService.smtp_username, EmailService.smtp_password)
                server.sendmail(EmailService.sender_email, receiver_email, message.as_string())
                print("Correo electrónico enviado exitosamente")
        except Exception as e:
                 print(e)


    @staticmethod
    def send_email(receiver_email: str, receiver_name, pack_id, current_status, tracking_link):
        content = EmailService.load_content(receiver_name, pack_id, current_status, tracking_link)
        message = EmailService.form_message(content, receiver_email)
        EmailService.notify(message, receiver_email)

