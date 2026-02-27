pipeline {
  agent {
    kubernetes {
      yaml """
apiVersion: v1
kind: Pod
spec:
  nodeSelector:
    alpha.eksctl.io/nodegroup-name: jenkins-node
  containers:
  - name: jenkins-agent
    image: nourzakhama2003/jenkins-agent:latest
    command:
    - cat
    tty: true
    env:
    - name: DOCKER_HOST
      value: tcp://localhost:2375
  - name: dind
    image: docker:24.0.9-dind
    securityContext:
      privileged: true
    env:
    - name: DOCKER_TLS_CERTDIR
      value: ""
    - name: DOCKER_HOST
      value: tcp://0.0.0.0:2375
  volumes: []
"""
      defaultContainer 'jenkins-agent'
    }
  }
  environment {
    AWS_REGION = 'eu-north-1'
    ECR_REGISTRY = '083347785255.dkr.ecr.eu-north-1.amazonaws.com'
    IMAGE_NAME = 'nourzakhama2003/express-backend'
    DOCKER_HOST = 'tcp://localhost:2375'
  }
  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }
    stage('Build Docker Image') {
      steps {
        sh """
          sleep 5  # wait for dind to start
          docker build -t ${ECR_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER} .
        """
      }
    }
    stage('Push to ECR') {
      steps {
        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-ecr-creds']]) {
          sh """
            aws ecr get-login-password --region ${AWS_REGION} | \
            docker login --username AWS --password-stdin ${ECR_REGISTRY}
            docker push ${ECR_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}
          """
        }
      }
    }
    stage('Deploy to EKS') {
      steps {
        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-ecr-creds']]) {
          sh """
            aws eks update-kubeconfig --name demo-test --region ${AWS_REGION}
            kubectl set image deployment/backend backend=${ECR_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER} -n prod
          """
        }
      }
    }
  }
}