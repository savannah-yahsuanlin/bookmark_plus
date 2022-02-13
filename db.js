const {Sequelize, DataTypes, models} = require('sequelize')
const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_bookmarks_plus')


const Bookmark = db.define('bookmark', {
	name: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
			notEmpty: true
		}
	}
});

const Category = db.define('category', {
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	}
})

Bookmark.belongsTo(Category)
Category.hasMany(Bookmark)

const seedAndSync = async() => {
	await db.sync({force: true})
	const coding = await Category.create({name: 'coding'})
	const search = await Category.create({name: 'seach'})
	const jobs = await Category.create({name: 'jobs'})


	await Bookmark.create({name: 'google.com', categoryId: search.id })
	await Bookmark.create({name: 'stackoverflow.com', categoryId: coding.id})
	await Bookmark.create({name: 'bing.com', categoryId: search.id})
	await Bookmark.create({name: 'linkedin.com', categoryId: jobs.id})
	await Bookmark.create({name: 'indeed.com', categoryId: jobs.id})
	await Bookmark.create({name: 'msdn.com', categoryId: search.id})	
}


module.exports = {
	seedAndSync,
	db,
	models: {
		Bookmark,
		Category
	}
}