# Sado triathlon type A athlete tracker


## Architecture

![](2024-09-02-11-39-25.png)

## backend

### Reuqirements

- Docker
  - docker-compose
- python >= 3.14
  - pip
- Ruby
  - bundler
- GitHub
  - GitHub personal access token


Scrape original list and upload combined CSV file to the gist.

### setup
```
cd backend
cp .env.sample .env
vim .env
pip3 install -r requirements.txt
bundle install
```

### execute
```
bash loop.sh
```

## frontend


reuqirements: NodeJS


### dev
```
cd front
npm install
npm start
open 'http://localhost:3000/'
```


### build

```
npm build
```

## Deployment

This project is ready for Vercel.

## Contribution

- By code, pull requests are welcomed.
- By supplying caffein.

<a href="https://www.buymeacoffee.com/matsubokkuri" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>

