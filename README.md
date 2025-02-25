# Iris Back

This project is the backend for the Iris ToDo App, built with NestJS and deployed using Serverless Framework on AWS. It provides a REST API for managing tasks and user authentication with JWT.

## Features

- **ToDo CRUD:** Create, read, update, and delete tasks stored in DynamoDB.
- **User Authentication:** Register and log in users with password hashing (bcrypt) and JWT authentication.
- **Serverless Deployment:** AWS Lambda functions with DynamoDB resources managed via CloudFormation.

## Setup

### 1. Clone the repository:

```bash
cd iris-back
````

### 2. Install dependencies:

```bash
npm install
````

### 3. Update serverless.yml


### 4. Run Locally

```bash
npx serverless offline --stage dev --profile dev-sergio
````

### 5. Deploy to AWS

```bash
npx serverless deploy --stage dev --profile dev-sergio
````


### Authentication

```bash
Authorization: Bearer <token>
````



### POSTMAN Documentation

```bash
https://documenter.getpostman.com/view/20774465/2sAYdeMsE9
```