pipeline {
  agent {
    kubernetes {
      yaml """
apiVersion: v1
kind: Pod
spec:
  nodeSelector:
    eks.amazonaws.com/compute-type: ec2
  containers:
  - name: jenkins-agent
    image: nourzakhama2003/jenkins-agent:latest
    command:
    - cat
    tty: true
    securityContext:
      privileged: true
    volumeMounts:
    - name: docker-sock
      mountPath: /var/run/docker.sock
  volumes:
  - name: docker-sock
    hostPath:
      path: /var/run/docker.sock
"""
      defaultContainer 'jenkins-agent'
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
        sh "docker build -t ${ECR_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER} ."
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