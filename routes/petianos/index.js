const path = require('path');
const app = require(path.join(__dirname, '../../index')).app;
const router = require('express').Router();
const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');
const PETiano = app.get('models').PETiano;

const parser = multer({
	storage: cloudinaryStorage({
		cloudinary: cloudinary,
		folder: (req, file, cb) => {
			if (file.fieldname === 'Photo')
				cb(undefined, 'userProfile');
			else if (file.fieldname === 'CoverPhoto')
				cb(undefined, 'userCover');
		},
		filename: (req, file, cb) => {
			cb(undefined, req.user.Login);
		}
	})
});

router.get('/', (req, res) => {
	let query = {where: {}};
	if (req.query.Profile)
		query.where.Profile = req.body.Profile;
	PETiano
		.findAll(query)
		.then(function(result) {
			res.json(result);
			res.end();
		}, function(err) {
			res.status(500);
			res.send({message: 'Erro interno'});
		})
})

router.get('/:petianoId', (req, res) => {
	if (req.user.Id === req.params.petianoId)
		return res.status(200).json(req.user);
	PETiano
		.findById(req.params.petianoId)
		.then(result => res.status(200).json(result.toJSON()))
		.catch(err => res.status(500).send({ message: 'Erro interno' }))
})


router.put('/', (req, res) => {
	const uploader = parser.fields([
		{name:'Photo', maxCount:1},
		{name: 'CoverPhoto', maxCount:1}
	]);
	uploader(req, res, err => {
		if (err)
			return res.status(500).json({ message: 'Erro interno' });
		let user = req.user;
		let newUser = req.body;
		if (req.files && req.files.Photo)
			user.set('Photo', req.files.Photo[0].secure_url + '?f=auto');
		if (req.files && req.files.CoverPhoto)
			user.set('CoverPhoto', req.files.CoverPhoto[0].secure_url + '?f=auto');
		if (newUser.Name)
			user.set('Name', newUser.Name);
		if (newUser.Email)
			user.set('Email', newUser.Email);
		if (newUser.Cpf !== undefined)
			user.set('Cpf', newUser.Cpf);
		if (newUser.Rg !== undefined)
			user.set('Rg', newUser.Rg);
		if (newUser.OldPassword && newUser.Password && user.comparePassword(newUser.OldPassword))
			user.set('Password', newUser.Password);
		user
			.save()
			.then(result => res.status(200).json(result))
			.catch(err => res.status(500).json({ message: 'Erro interno' }));

	})

});

module.exports = router;
