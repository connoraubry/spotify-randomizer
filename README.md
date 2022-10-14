# spotify-randomizer
Fixing Spotify's randomization because they refuse to do so 

Personal project to learn React / typescript / API integration. 

## Running
Either run using docker or using node

### Docker
```bash
docker-compose up
```

### Node (dev)
All following commands are from the top level directory.

1. Install all packages locally. All commands from top-level
    ```bash
    npm install .
    cd api && npm install . && cd ..
    cd client && npm install . && cd ..
    ```
2. Run from top level 
    ```bash
    npm run start
    ```