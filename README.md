- 1) Install Pip
```sh
$ sudo apt-get install python-pip
```

- 2) Install aws cli
```sh
$ pip install awscli
```

- 3) Configure AWS CLI (enter AWS Access Key ID and Secret Access Key):
```sh
$ aws configure
```

- 4) Install serverless framework
```sh
$ npm install -g serverless
```

- 5) Initializing the application (this step only for creating new project)
```sh
$ serverless create --template aws-nodejs --name {name-of-your-project}
```

Deploy serverless application
-----------------------------
```sh
$ npm run deploy
```

Create mail templates
-----------------------------
```sh
$ npm run init-templates
```

Run serverless offline
-----------------------------
```sh
$ npm run sls-offline
```