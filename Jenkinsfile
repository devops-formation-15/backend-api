pipline{
    agent any
    tools {
        nodejs 'Node20'
    }
    stages{
        stage('Unit Tests') {
            steps {
                bat 'npm ci'
                bat 'npm run test'
            }
        }
    }

}



// pipeline {
//     agent any  // Runs on your local Windows agent (or change to label/docker later)

//     tools {
//         nodejs 'Node20'  // Configure this in Manage Jenkins → Tools → NodeJS (install Node 20+)
//     }

//     // Environment like your GH env block
//     environment {
//         VERSION_NUMBER         = "${BUILD_NUMBER}"  // Auto like github.run_number
//         SERVICE_NAME           = credentials('SERVICE_NAME')           // Add in Credentials: secret text
//         IMAGE_NAME             = credentials('IMAGE_NAME')             // e.g. nourzakhama2003/backend-api
//         DOCKER_COMPOSE_LOCATION = credentials('DOCKER_COMPOSE_LOCATION') // e.g. /path/on/vps
//         // Optional: DOCKERHUB_USERNAME as var/credential if needed
//     }

//     // Triggers: push to main + manual (Build Now)
//     triggers {
//         githubPush()  // Requires GitHub plugin + webhook (your ngrok setup)
//     }

//     stages {
//         stage('Unit Tests') {
//             steps {
//                 bat 'npm ci'          // npm install (ci is faster/cleaner)
//                 bat 'npm run test'    // Your unit tests
//             }
//         }

//         stage('Trivy Filesystem Security Scan') {
//             when { branch 'main' }  // Like needs: unit-test
//             steps {
//                 echo 'Scanning codebase with Trivy (fs mode)...'
//                 // Install Trivy if not present (one-time, or pre-install on agent)
//                 bat '''
//                     curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b .
//                     trivy fs --exit-code 1 --no-progress --ignore-unfixed --severity CRITICAL,HIGH .
//                 '''
//             }
//         }

//         stage('Snyk Dependency Security Scan') {
//             when { branch 'main' }
//             steps {
//                 echo 'Scanning dependencies with Snyk...'
//                 bat 'npm install -g snyk'  // Install Snyk CLI
//                 withCredentials([string(credentialsId: 'SNYK_TOKEN', variable: 'SNYK_TOKEN')]) {
//                     bat '''
//                         snyk auth %SNYK_TOKEN%
//                         snyk test --severity-threshold=high
//                         snyk monitor --org=devops-formation-15 || true  // Continue even if issues
//                     '''
//                 }
//                 // Optional: snyk container test if you want image scan later
//             }
//         }

//         stage('Build & Push Docker Image') {
//             when { branch 'main' }
//             steps {
//                 echo 'Building and pushing Docker image...'
//                 withCredentials([
//                     usernamePassword(credentialsId: 'dockerhub-credentials',  // Add in Credentials: username+password
//                                      usernameVariable: 'DOCKER_USER',
//                                      passwordVariable: 'DOCKER_PASS')
//                 ]) {
//                     bat '''
//                         echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin
//                         docker build -t %IMAGE_NAME% .
//                         docker tag %IMAGE_NAME% %IMAGE_NAME%:v%BUILD_NUMBER%
//                         docker push %IMAGE_NAME%:latest
//                         docker push %IMAGE_NAME%:v%BUILD_NUMBER%
//                     '''
//                 }
//             }
//         }

//         stage('Deploy to VPS via SSH') {
//             when { branch 'main' }
//             steps {
//                 echo 'Deploying to production...'
//                 withCredentials([
//                     sshUserPrivateKey(credentialsId: 'vps-ssh-key',   // Better: use key instead of password
//                                       keyFileVariable: 'SSH_KEY',
//                                       usernameVariable: 'SSH_USER'),
//                     string(credentialsId: 'VPS_HOST', variable: 'VPS_HOST')
//                 ]) {
//                     bat '''
//                         ssh -o StrictHostKeyChecking=no -i %SSH_KEY% %SSH_USER%@%VPS_HOST% "
//                             cd %DOCKER_COMPOSE_LOCATION%
//                             echo 'Pulling backend image...'
//                             docker compose pull %SERVICE_NAME%
//                             echo 'Running the new image...'
//                             docker compose up -d --force-recreate %SERVICE_NAME%
//                         "
//                     '''
//                 }
//                 // Alternative: if password only, use sshPublisher step (install SSH Pipeline Steps plugin)
//             }
//         }
//     }

//     post {
//         always {
//             echo 'Pipeline finished (clean up if needed)'
//             // Optional: cleanWs() to wipe workspace
//         }
//         success {
//             echo '✅ All stages passed!'
//         }
//         failure {
//             echo '❌ Pipeline failed – check logs'
//         }
//     }
// }