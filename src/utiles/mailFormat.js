export const mailHtml = function (email, name, institute, certificateId) {
    return (
        `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
                    body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #4CAF50;
            color: #fff;
            padding: 10px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            color: #777;
            margin-top: 20px;
            font-size: 0.8em;
        }
        .btn {
            display: inline-block;
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
        }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Welcome to QuickUp</h1>
                    </div>
                    <div class="content">
                        <p>Hello ${name},</p>
                        <p>Thank you for Choosing. We are thrilled to have you on board!</p>
                        <p>Below are your Certificate details:</p>
                        <ul>
                        <li><strong>Name:-</strong> ${name}</li>
                            <li><strong>Email:-</strong> ${email}</li>
                            <li><strong>Certificate:-</strong> ${certificateId}</li>
                            <li><strong>Institute:-</strong> ${institute}</li>
                        </ul>
                        <p>If you have any questions, feel free to reply to this email. We're here to help!</p>
                        <p>Best regards,</p>
                        <p>The QuickUp Team</p>
                        <p><a href="/github/SudhirYadav5678" class="btn">Download</a></p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2024 QuickUp. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    )
}

