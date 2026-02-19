pipeline {
    agent any

    tools {
        nodejs 'Node20'  // Make sure this matches the name configured in Global Tool Configuration
    }

    environment {
        VERSION_NUMBER          = "${BUILD_NUMBER}"
        SERVICE_NAME            = "backend"
        IMAGE_NAME              = "nourzakhama2003/express-backend"   // ← your Docker Hub repo
        DOCKER_COMPOSE_LOCATION = "~/projects/shop"                   // path on your VPS
        DOCKERHUB_CREDENTIALS   = "dockerhub-credentials"             // ← we'll create this
    }

    stages {
        stage('Install Dependencies & Unit Tests') {
            steps {
                sh 'npm ci'
                sh 'npm run test'
            }
        }

        stage('Build & Push Docker Image') {
            steps {
                script {
                    // This handles both login + push cleanly (no plain-text password in logs)
                    docker.withRegistry('https://index.docker.io/v1/', env.DOCKERHUB_CREDENTIALS) {
                        def image = docker.build("${IMAGE_NAME}")
                        
                        // Push two tags: latest + versioned
                        image.push('latest')
                        image.push("v${VERSION_NUMBER}")
                    }
                }
            }
        }

        stage('Deploy to VPS') {
            steps {
                withCredentials([
                    string(credentialsId: 'VPS_HOST',     variable: 'VPS_HOST'),
                    string(credentialsId: 'VPS_USERNAME', variable: 'VPS_USER'),
                    string(credentialsId: 'VPS_PASSWORD', variable: 'VPS_PASS')
                ]) {
                    sh """
                        sshpass -p "\${VPS_PASS}" ssh -o StrictHostKeyChecking=no "\${VPS_USER}@\${VPS_HOST}" "
                            cd ${DOCKER_COMPOSE_LOCATION}
                            echo 'Pulling new image...'
                            docker compose pull ${SERVICE_NAME}
                            echo 'Restarting container...'
                            docker compose up -d --force-recreate ${SERVICE_NAME}
                        "
                    """
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished'
        }
        success {
            echo '✅ Success!'
        }
        failure {
            echo '❌ Failed – check logs'
        }
    }
}