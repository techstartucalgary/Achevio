# Achevio Backend

Welcome to the Achevio Backend repository! This project is designed to serve as the backend service for the Achevio application, handling all the data processing, storage, and API services required to power the front-end experience.

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
   litestar run -rd
   ```

   The `-rd` flag is optional, `-r` is for reload, so that the api will automaticall relaunch whenever it detects a change in the sourcefile (great for development while testing!), and the `-d` is for debug, LiteStar will be giving more detailed traceback messages. Both are optional and you can feel free to omit them.

Once the service is up, you can access the API at: `http://127.0.0.1:8000/schema/swagger`

And that's it! you can start developing 🎉!

## Good practices for development

- Use an IDE or text editor of your choice to make changes.
- Ensure code style and quality guidelines are followed.
- Test locally before pushing to the repository.

## License

This project is licensed under the MIT License

---

I hope you enjoy working with the Achevio Backend. Let's build something amazing together! 🚀
