# DupRow - Made by yKiraz

A simple bot that duplicates a row, the new one will get the exact permissions of the previous to it channel, and to itself.

## 🚀 Prerequisites

Make sure you have installed:

-   Node.js (v16+ recommended)
-   npm (comes with Node)

Check installation:

    node -v
    npm -v

## 📦 Installation

Clone the repository:

    git clone https://github.com/your-username/your-repo.git
    cd your-repo

Install dependencies (in a Command Prompt, not powershell):

    npm install

## ⚙️ Configuration

Create your real .env file:

    cp .env.example .env

Change 'YOUR_TOKEN' and 'DISCORD_BOT_ID' to the bot token and it discord ID

    TOKEN='ABCDEFG' # EXAMPLE
    CLIENT_ID='123456' # EXAMPLE

In discord, make sure the Bot's Row is in the top, and has admin permissions

## ▶️ Running the Project

node run.js

## 📁 Project Structure (example)

    yourproject/
    │   └──  commands
    │         │──  duprow.js
    │         │──  rolehelp.js
    │         └──  testrow.js         
    │── .env
    │── package-lock.json    
    │── package.json
    │── README.md
    │── node_modules
    └── run.js

## ✨ How to use it

Make sure to reset your own discord after running the bot, after you do that, the aplication will have the following resources:

- /duprow 

    Tag the first role to mark as the original, name the new role after it. For example:
    /duprow @member copymember

- /rolehelp

    Showcase a simple guide to use the bot

- /testrow

    Tag the row you want to test, it will show some permission information.

## 📜 LICENSE

Copyright (c) ykiraz

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to use, copy, modify, merge, publish, and distribute the Software for personal, non-commercial, or community use only, subject to the following conditions:

Commercial use is strictly prohibited.
You may not sell, license, rent, or commercially profit from the Software or any derivative works.

Attribution is required.
Any use, fork, or distribution of this project must clearly credit the original author, ykiraz, and state that the project was created with assistance from Claude and ChatGPT.

Derivative works must remain non-commercial.
Any modified versions of the Software must be released under this same license.

No warranty.
The Software is provided "as is", without warranty of any kind, express or implied.
The author is not liable for any damages or issues arising from the use of the Software.

By using this Software, you agree to the terms of this License.
