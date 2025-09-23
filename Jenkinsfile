pipeline {
    agent any
    
    environment {
        DOCKER_HUB_CREDENTIALS = credentials('dockerhub-password')
        DOCKER_HUB_USERNAME = 'umesh404'  // Your Docker Hub username
        DOCKER_HUB_PASSWORD = credentials('dockerhub-password')
        IMAGE_TAG = "${env.BUILD_NUMBER}"
        REGISTRY = 'docker.io'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }
        
        stage('Build Backend Image') {
            steps {
                echo 'Building backend Docker image...'
                bat '''
                    docker build -t hkare-backend:latest -t hkare-backend:%IMAGE_TAG% ./backend
                    docker tag hkare-backend:latest %DOCKER_HUB_USERNAME%/hkare-backend:latest
                    docker tag hkare-backend:%IMAGE_TAG% %DOCKER_HUB_USERNAME%/hkare-backend:%IMAGE_TAG%
                '''
            }
        }
        
        stage('Build Frontend Image') {
            steps {
                echo 'Building frontend Docker image...'
                bat '''
                    docker build -t hkare-frontend:latest -t hkare-frontend:%IMAGE_TAG% ./frontend
                    docker tag hkare-frontend:latest %DOCKER_HUB_USERNAME%/hkare-frontend:latest
                    docker tag hkare-frontend:%IMAGE_TAG% %DOCKER_HUB_USERNAME%/hkare-frontend:%IMAGE_TAG%
                '''
            }
        }
        
        stage('Login to Docker Hub') {
            steps {
                echo 'Logging in to Docker Hub...'
                bat '''
                    echo %DOCKER_HUB_PASSWORD% | docker login -u %DOCKER_HUB_USERNAME% --password-stdin
                '''
            }
        }
        
        stage('Push Images to Docker Hub') {
            parallel {
                stage('Push Backend') {
                    steps {
                        echo 'Pushing backend image to Docker Hub...'
                        bat '''
                            docker push %DOCKER_HUB_USERNAME%/hkare-backend:latest
                            docker push %DOCKER_HUB_USERNAME%/hkare-backend:%IMAGE_TAG%
                        '''
                    }
                }
                stage('Push Frontend') {
                    steps {
                        echo 'Pushing frontend image to Docker Hub...'
                        bat '''
                            docker push %DOCKER_HUB_USERNAME%/hkare-frontend:latest
                            docker push %DOCKER_HUB_USERNAME%/hkare-frontend:%IMAGE_TAG%
                        '''
                    }
                }
            }
        }
        
        stage('Cleanup Local Images') {
            steps {
                echo 'Cleaning up local Docker images...'
                bat '''
                    docker rmi hkare-backend:latest hkare-backend:%IMAGE_TAG% || echo "Backend images not found"
                    docker rmi hkare-frontend:latest hkare-frontend:%IMAGE_TAG% || echo "Frontend images not found"
                    docker logout
                '''
            }
        }
        
        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                echo 'Deploying to production...'
                bat '''
                    if exist docker-compose.prod.yml (
                        docker-compose -f docker-compose.prod.yml down
                        docker-compose -f docker-compose.prod.yml pull
                        docker-compose -f docker-compose.prod.yml up -d
                    ) else (
                        echo "Production compose file not found"
                    )
                '''
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline completed'
            cleanWs()
        }
        success {
            echo 'Pipeline succeeded!'
            // You can add notifications here (email, Slack, etc.)
        }
        failure {
            echo 'Pipeline failed!'
            // You can add failure notifications here
        }
    }
}