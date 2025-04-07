# Collaborative Code Editor

A real-time collaborative code editor built using React, Node.js, MongoDB, and Socket.IO that allows multiple users to collaborate in a room to write, edit, and execute code together.

## Features

- **Real-time code editing**: Multiple users can edit the same code simultaneously, with changes reflected instantly for all participants.
- **Code execution**: Users can run code directly within the editor and view the output.
- **Room-based collaboration**: Users can join separate rooms for different projects, ensuring isolated environments for collaborative work.
- **Locking/Unlocking feature**: Only one person can edit at a time, preventing editing conflicts.
- **Clean and modern UI**: A user-friendly interface with modern styling for enhanced usability.
- **Real-time syncing**: Changes are synced instantly using Socket.IO, providing a seamless collaboration experience.
- there are worries of glitiching when people type at a time i managed it by locking editor for other and unlock for all for 20sec of no activity

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Real-time communication**: Socket.IO

## Demo

You can check out the live demo of the project here: [Collaborative Code Editor](https://courageous-fairy-23027e.netlify.app/)

## Repositories

- **Frontend repository**: [code_collab_frontend](https://github.com/Raghavnadiminti/code_collab_frontend)
- **Backend repository**: [code_collab_backend](https://github.com/Raghavnadiminti/code_collab_backend)

