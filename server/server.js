const
	dotenv = require('dotenv').load(),
	express = require('express'),
	app = express(),
	logger = require('morgan'),
	bodyParser = require('body-parser'),
	cors = require('cors'),
	mongoose = require('mongoose'),
	MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/react-express-jwt',
	PORT = process.env.PORT || 3001,
	usersRoutes = require('./routes/users.js'),
	clientRoutes = require('./routes/client.js'),
	adminRoutes = require('./routes/admin.js')

mongoose.set('useCreateIndex', true)
mongoose.connect(MONGODB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
}, (err) => {
	console.log(err || `Connected to MongoDB.`)
})

// app.use(express.static(`${__dirname}/client/build`))
app.use('/', express.static(`${__dirname}/../client`))
app.use('/admin', express.static(`${__dirname}/../admin`))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get('/api', (req, res) => {
	res.json({message: "API root."})
})

app.use('/api/users', usersRoutes)
app.use('/api/client', clientRoutes)
app.use('/api/admin', adminRoutes)

// app.use('*', (req, res) => {
// 	res.sendFile(`${__dirname}/client/build/index.html`)
// })

app.listen(PORT, (err) => {
	console.log(err || `Server running on port ${PORT}.`)
})
