pipeline {
    agent {
        kubernetes {
            yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: docker
    image: docker:24.0.9-dind
    securityContext:
      privileged: true
    env:
    - name: DOCKER_TLS_CERTDIR
      value: ""
  - name: aws-cli
    image: amazon/aws-cli:latest
    command: ["sleep"]
    args: ["infinity"]
  - name: kubectl
    image: bitnami/kubectl:latest
    command: ["sleep"]
    args: ["infinity"]
"""
        }
    }
    environment {
        AWS_REGION = 'eu-north-1'
        ECR_REGISTRY = '083347785255.dkr.ecr.eu-north-1.amazonaws.com'
        IMAGE_NAME = 'nourzakhama2003/express-backend'
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Build Docker Image') {
            steps {
                container('docker') {
                    sh "docker build -t ${ECR_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER} ."
                }
            }
        }
        stage('Push to ECR') {
            steps {
                container('aws-cli') {
                    withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-ecr-creds']]) {
                        sh """
                            aws ecr get-login-password --region ${AWS_REGION} | \
                            docker login --username AWS --password-stdin ${ECR_REGISTRY}
                            docker push ${ECR_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}
                        """
                    }
                }
            }
        }
        stage('Deploy to EKS') {
            steps {
                container('kubectl') {
                    withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-ecr-creds']]) {
                        sh """
                            aws eks update-kubeconfig --name demo-test --region ${AWS_REGION}
                            kubectl set image deployment/backend backend=${ECR_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}
                        """
                    }
                }
            }
        }
    }
}

