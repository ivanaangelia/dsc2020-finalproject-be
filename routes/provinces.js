const express = require('express')

const router = express.Router()

const middleware = (req, res, next) => {
    const apiKey = req.headers['x-api-key']
    if (apiKey === undefined) return res.send({ status: false, message: 'Api key not found' })
    else if (apiKey != 'DSC2020BACKEND') return res.send({ status: false, message: 'Api key invalid' })
    next()
}

router.use(middleware)

const provinceController = require('../controllers/provinces')
router.post('/add', provinceController.addProvince)

router.get('/', provinceController.getProvinces)

router.get('/:id', provinceController.getProvince)

router.put('/', provinceController.updateProvince)

router.delete('/', provinceController.deleteProvince)

module.exports = router
