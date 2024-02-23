# Achevio Backend

Welcome to the Achevio Backend ReadMe Section! This project is designed to serve as the backend service for the Achevio application, handling all the data processing, storage, and API services required to power the front-end experience.

## Getting Started

To get the backend service up and running, you'll need to have Docker installed on your machine. Once you have Docker, you can use `docker-compose` to build and start the service.

### Prerequisites

- Docker
- Docker Compose

### Installation and Setup

1. **Clone the Repository**

   Start by cloning the repository to your local machine:

   ```sh
   git clone https://github.com/techstartucalgary/Achevio.git
   cd Achevio/Backend
   ```

2. **Environment Variables**

   Before starting the service, make sure to create a `.env` file at the root of the `Backend` directory with the necessary environment variables. An example `.env.example` file should be provided for reference.
   You can instead also do

   ```sh
    cp .env.example .env
   ```

3. **Build and Run with Docker Compose**

   With Docker Compose, you can easily build and start the services:

   ```sh
   docker-compose up --build
   ```

   The `--build` flag is optional and is used to build the images before starting the containers. If you have already built the images, you can omit this flag.

   To run in detached mode, use the `-d` flag:

   ```sh
   docker-compose up -d
   ```

4. **Stopping the Service**

   To stop the service, you can use the following command:

   ```sh
   docker-compose down
   ```

5. **Setting up the development environment**
   Install all necessary dependencies via (use a virtual environment for good practice, I recommend conda, but you can use whatever you like!)

   ```sh
   pip install -r requirements.txt
   ```

6. **Launching the api**

   Run

   ```sh
   litestar run -r -H {YourIpAddress} --port {yourPort}
   ```

   The `-rd` flag is optional, `-r` is for reload, so that the api will automaticall relaunch whenever it detects a change in the sourcefile (great for development while testing!), and the `-d` is for debug, LiteStar will be giving more detailed traceback messages. Both are optional and you can feel free to omit them.

Once the service is up, you can access the API at: `http://{yourIPaddress}:{yourPort}/schema/swagger`

---

# Achevio Frontend

Welcome to the Achevio Frontend ReadMe Section! This section of the project is focused on building a user-friendly interface for interacting with the Achevio application. The frontend is designed to communicate with the backend service to fetch, display, and manipulate data.

## Getting Started

Setting up the frontend development environment requires a few key steps, including installing Node.js, the Expo CLI, and project dependencies.

### Prerequisites

- Node.js
- Expo CLI

### Installation and Setup

1. **Install Node.js**

   Download and install Node.js from [the official Node.js website](https://nodejs.org/). This will also install `npm`, which is Node.js' package manager.

2. **Install Expo CLI**

   Expo is an open-source platform for making universal native apps for Android, iOS, and the web with JavaScript and React. Install the Expo CLI globally using `npm`:

   ```sh
   npm install -g expo-cli
   ```

3. **Clone the Repository**

   If you haven't already, clone the Achevio repository to your local machine and navigate to the Frontend directory:

   ```sh
   git clone https://github.com/techstartucalgary/Achevio.git
   cd Achevio/Frontend
   ```

4. **Install Dependencies**

   Install the necessary project dependencies using `npm`:

   ```sh
   npm install
   ```

5. **Start the Development Server**

   Launch the development server with Expo:

   ```sh
   npm start
   ```

   This command will start the Expo development server and open a web page in your default browser. You can then run the app on an iOS or Android simulator, or on a physical device using the Expo app.

6. **Viewing the App**

   After starting the development server, you can view the app by scanning the QR code displayed in the terminal or command prompt with the Expo app (available on Android and iOS) if you're using a physical device. For simulators, follow the instructions in the terminal or the Expo developer tools web interface.

7. **Connecting the Frontend With the Backend**

   Go to app/redux/reducers.tsx and add the your IP address in the initial state object ( You can get that ip through running npm start and it will show up in metro line like :=  Metro waiting on exp://10.0.0.244 )
   make sure that the backend server is running on the same IP address.

### Additional Notes

- Ensure your backend service is running, as the frontend will need to communicate with it.
- For detailed documentation on Expo and its features, visit the [Expo documentation](https://docs.expo.dev/).

---

And that's it! you can start developing 🎉!

## Good practices for development

- Use an IDE or text editor of your choice to make changes.
- Ensure code style and quality guidelines are followed.
- Test locally before pushing to the repository.

## License

This project is licensed under the MIT License

---

I hope you enjoy working with the Achevio Backend. Let's build something amazing together! 🚀
