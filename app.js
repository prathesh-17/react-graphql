const express=require('express')
const bodyParser = require('body-parser')
const graphHttp= require('express-graphql')
const mongoose=require('mongoose')
const graphqlSchema= require('./graphql/schema/index')
const graphqlResolvers= require('./graphql/resolvers/index')
const isAuth = require('./isAuth')

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PWD}@cluster0-pglcg.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
    .then(()=>app.listen(8000))
    .catch((err)=>{console.log(err)})

const app=express()

app.use(bodyParser.json())

app.use((req, res, next) => {
  console.log('Middleware running...')
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    console.log('options running...')
    return res.sendStatus(200);
  }
  console.log(req.body)
  next();
});

app.use(isAuth)

app.use('/graphql',graphHttp({
    schema:graphqlSchema,
    rootValue:graphqlResolvers,
    graphiql:true

}))


app.get('/',(req,res)=>{
    res.send('hello world');
})


