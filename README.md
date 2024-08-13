## GraphQL API with Clean Architecture 🚀

This api design allows to use graphql implementation without touch on any business rules
it is possible to implement a Ports and Adapters (Hexagonal) approach as well.

## Details

- <b>Code First Approach</b>: This is a code first implementation of GraphQL.
- <b>Only necessary LIBS</b>: This project has just necessary libs for use Graphql with code first and clean arch
- <b>Clean Arch</b>: This Project it's using concepts of clean architecture so, developers are free to change technologies without touch on business rules.
- <b>Ci</b>: This project implements all the path to deliver the application on a production environment using technologies like: terraform, github actions and aws environment.

## 🛠 Technologies Used

- Apollo Server
- TypeGraphQL
- TSyringe
- Express
- Terraform
- Knex
- AWS Environment
- Github Actions
- Docker

## 💡 Features

- [Create User]: Create a new User on DB.
- [Sign In]: Sign In with email and password.
- [List Users]: List users.
- [List Users Public]: List users with a public endpoint.

### GitHub Actions Vars

- REPOSITORY_NAME

### GitHub Actions Secrets

- APP_ID= "string"
- AWS_ACCESS_KEY= "string"
- AWS_ACCOUNT_ID= "string"
- AWS_EC2_PRIVATE_KEY= "string"
- AWS_EC2_PUBLIC_KEY= "string"
- AWS_ECR_GITHUB_ROLE= "string"
- AWS_SECRET_KEY= "string"
- DATABASE_PASSWORD= "string"
- DATABASE_URL= "string"
- DATABASE_USER= "string"
- EC2_PUBLIC_IP= "string"
- GH_APP_PRIVATE_KEY= "string"

### Actions

- Setup AWS Infra
- Delete AWS Infra
- Deploy Application

### Next Steps

- It would be great to improve build time and size with terraform and gh actions
- Add more aws tools like ELB and ECS to manage containers and working with auto scaling

### Examples

```graphql
# Get Users (Public Route)
query PublicUsers {
  publicUsers {
    result {
      userId
      registerStatus
      userName
      createdAt
      updatedAt
      deletedAt
      avatar {
        url
      }
    }
  }
}
```

```graphql
# Create User
mutation CreateUser($email: String!, $password: String!, $name: String!) {
  createUser(email: $email, password: $password, name: $name) {
    email
  }
}
```

```graphql
# Sign In
mutation SignIn($email: String!, $password: String!) {
  signIn(email: $email, password: $password) {
    email
    token
  }
}
```

```graphql
# Users (Auth Route)
query Users($limit: Int!, $offset: Int!, $registerStatus: String) {
  users(limit: $limit, offset: $offset, registerStatus: $registerStatus) {
    result {
      userId
      registerStatus
      userName
      createdAt
      updatedAt
      deletedAt
      avatar {
        url
      }
    }
    pagination {
      limit
      total
      offset
    }
  }
}
```
