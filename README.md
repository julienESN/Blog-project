# Welcome to Esnault_Julien_Blog !

Here is a brief tutorial to assist you in using this blog.

## First Step, Clone the repository

Use the `git clone` command to clone the repository to your local machine.
Via HTTPS: `https://github.com/julienESN/julien_esnault_blog.git`
Via SSH: `git@github.com:julienESN/julien_esnault_blog.git`

## Install Dependencies:

Navigate to the directory of the newly cloned project using the `cd` command. Then, run `npm install` to install all the necessary project dependencies.

```
cd <project-name>
npm install
```

## Create the `.env.local` File: :

Copy the `.env.example` file as `.env.local` and fill it with configurations specific to your environment. 
This may include database information, API keys, or other necessary environment variables.

```
cp .env.example .env.local
```

## Run Migrations:

Use Knex to run migrations and create the database structure using the following command:

```
npx knex migrate:latest
```

## Run Seed Script:

Add test data to your database by executing the seed script:

```
npx knex seed:run
```

## Administrator Account Credentials:

Administrator account credentials are provided in the seed file.

## Start the Application:

Use the appropriate command to start your application.

```
npm start
```

## Run the Application:

You can now access the application in your browser using the URL specified in your `.env.local` file.
You may need to create a user account if it was not included in the seed script.
