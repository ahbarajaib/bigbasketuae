//middleware to handle which is not a path if entered route is not
//a route in app then this will kick
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`)
  res.status(404)
  next(error)
}
//error middleware
const errorHandler = (err, req, res, next) => {
  //if its 200 make it 500 video 4.9
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode
  res.status(statusCode)
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  })
}

export { notFound, errorHandler }
