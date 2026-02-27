pipeline {
   agent {
    docker {
      image 'nourzakhama2003/jenkins-agent:latest'
      args '-v /var/run/docker.sock:/var/run/docker.sock'
    }
  }
  environment {
    AWS_REGION = 'eu-north-1'
    ECR_REPO = '083347785255.dkr.ecr.eu-north-1.amazonaws.com/backend-api'
    CLUSTER_NAME = 'demo-test'
    KUBECONFIG_CREDENTIAL_ID = 'kubeconfig-demo-test'
    AWS_CREDENTIALS_ID = 'aws-ecr-creds'
    IMAGE_TAG = "${env.BUILD_NUMBER}"
  }
  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }
    stage('Docker Build & Push') {
      steps {
        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: "${AWS_CREDENTIALS_ID}"]]) {
          script {
            sh """
              aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REPO
              docker build -t $ECR_REPO:$IMAGE_TAG .
              docker push $ECR_REPO:$IMAGE_TAG
            """
          }
        }
      }
    }
    stage('Deploy to EKS') {
      steps {
        withCredentials([file(credentialsId: "${KUBECONFIG_CREDENTIAL_ID}", variable: 'KUBECONFIG')]) {
          script {
            sh """
              export KUBECONFIG=$KUBECONFIG
              kubectl set image deployment/backend-api backend-api=$ECR_REPO:$IMAGE_TAG -n default
            """
          }
        }
      }
    }
  }
}