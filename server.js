const express = require('express')
const methodOverride = require('method-override')

const {db, seedAndSync, models:{Bookmark, Category}} = require('./db')

const app = express()


app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))

app.get('/', (req, res) => {res.redirect('/bookmark')})

app.post('/bookmark', async(req, res, next) => {
	try{
		await Bookmark.create(req.body)
		res.redirect('/bookmark')
	}
	catch(ex) {
		next(ex)
	}
})

app.get('/bookmark', async(req, res, next) => {
	try {
		const categories = await Category.findAll({include: [Bookmark]})
		const bookmarks = await Bookmark.findAll({include: [Category]})
		res.send(`
			<html>
			<head>
				<link rel="stylesheet" href="/style.css">
			</head>
				<body>
					<h1>Acme Bookmarks</h1>
					<form method="POST">
						<input name="name" placeholder="bookmark">
						<select name="categoryId">
							${categories.map(category => `
								<option value="${category.id}"> ${category.name}</option>
							`)}
						</select>
						<button>Add</button>
					</form>
					<ul>
					${bookmarks.map(bookmark => `
					<li>
						${bookmark.id}
						${bookmark.name}
						<a href="/categories/${bookmark.categoryId}">${bookmark.category.name}</a>
					</li>
					`).join('')}
					</ul>
				</body>
			</html>
		`)
	}
	catch(ex) {
		next(ex)
	}
})

app.get('/categories/:id', async(req, res, next) => {
	try {
		const categories = await Category.findByPk(req.params.id, {include: [Bookmark]});
		res.send(`
			<html>
				<head>
					<link rel="stylesheet" href="/style.css">
				</head>
				<body>
					<h1>Acme Bookmarks</h1>
					<ul>
					${categories.bookmarks.map(bookmark => `
						<li>${bookmark.name}</li>
						<form method="POST" action="/bookmark/${bookmark.id}?_method=DELETE">
						<button>X</button>
						</form>
					`).join('')}
					</ul>
				</body>
			</html>
		`)
	}
	catch(ex) {
		next(ex)
	}
})

app.delete('/bookmark/:id', async(req, res, next) => {
	try {
		const bookmark = await Bookmark.findByPk(req.params.id)
		await bookmark.destroy()
		res.redirect('/bookmark')
	}
	catch(ex) {
		next(ex)
	}
})


const setUp = async() => {
	try {
		await seedAndSync()
		const port = process.env.PORT || 3001
		app.listen(port, () => {
			console.log(`Listening on port ${port}`)
		})
	}
	catch(ex) {
		console.log(ex)
	}
}

setUp()