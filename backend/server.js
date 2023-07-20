//es6 way of importing
import path from 'path'
import { resolve } from 'path'
import stripe from 'stripe'
import https from 'https'
import fs from 'fs'
import dotenv from 'dotenv'
import express from 'express'
import colors from 'colors'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import morgan from 'morgan'
//import products from './data/products.js'
import connectDB from './config/db.js'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import bodyParser from 'body-parser'
import cors from 'cors'
import nStatic from 'node-static'

// importing environmental variables
dotenv.config()

connectDB()

const app = express()

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
//middleware is a function that has access to req res cycle
app.use((req, res, next) => {
  //to check which URL triggered this console.log(req.originalUrl)

  next()
})

const staticDir = process.env.STATIC_DIR
const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY
const stripeInstance = stripe(stripeSecretKey, {
  apiVersion: '2022-08-01',
})

app.use(express.static(staticDir))

app.get('/', (req, res) => {
  const path = resolve(staticDir + '/index.html')
  res.sendFile(path)
})

app.get('/api/config/stripe', (req, res) => {
  res.send({
    publishableKey: stripePublishableKey,
  })
})
app.use(express.urlencoded({ extended: true }))

app.post('/create-payment-intent', async (req, res) => {
  try {
    const totalPrice = req.body.totalPrice * 100
    console.log(totalPrice)
    const paymentIntent = await stripeInstance.paymentIntents.create({
      currency: 'aed',
      amount: totalPrice,
      automatic_payment_methods: { enabled: true },
    })

    // Send publishable key and PaymentIntent details to client
    res.send({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message,
      },
    })
  }
})

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)



const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))



var fileServer = new nStatic.Server('./public');

// Define routes
app.get('/api/contactus', (req, res) => {
  // Handle GET request for /api/contactus
  res.send('Contact us page')
})

app.get('/api/delivery', (req, res) => {
  // Handle GET request for /api/delivery
  res.send('Delivery FAQ page')
})

app.get('/api/returns', (req, res) => {
  // Handle GET request for /api/returns
  res.send('Returns page')
})

app.get('/api/aboutus', (req, res) => {
  // Handle GET request for /api/aboutus
  res.send('About us page')
})

app.get('/api/privacy', (req, res) => {
  // Handle GET request for /api/privacy
  res.send('Privacy policy page')
})

app.get('/api/terms', (req, res) => {
  // Handle GET request for /api/terms
  res.send('Terms page')
})

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')))
  app.get('*', (req, res) =>
    res.sendFile(__dirname, 'frontend', 'build', 'index.html')
  )
} else {
  app.get('/', (req, res) => {
    res.send('API is running...')
  })
}

//@errorMiddleware.js middleware to handle which is not a path if entered route is not a
//route in app then this will kick
app.use(notFound)


//error middleware @errorMiddleware.js
app.use(errorHandler)
const PORT = process.env.PORT || 5000



// // ...

//  // Read the SSL certificate and key files
//  const privateKey = fs.readFileSync('/etc/letsencrypt/live/bigbasketuae.com/privkey.pem', 'utf8');
//  const certificate = fs.readFileSync('/etc/letsencrypt/live/bigbasketuae.com/fullchain.pem', 'utf8');
//  const credentials = { key: privateKey, cert: certificate };

//  // Create an HTTPS server
//  const httpsServer = https.createServer(credentials, app);

// // Start the HTTPS server
//  httpsServer.listen(PORT, () => {
//    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT} (HTTPS)`.yellow.bold);
//  });


app.listen(PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
)
