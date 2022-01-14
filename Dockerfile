FROM node:16.13.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN mkdir ./keys; cd keys && ssh-keygen -q -N '' -t rsa -b 4096 -m PEM -f private.key && openssl rsa -in private.key -pubout -outform PEM -out public.key && rm private.key.pub

EXPOSE 3000

CMD ["node", "index"]