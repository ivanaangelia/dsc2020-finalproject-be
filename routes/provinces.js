const express = require('express')

const router = express.Router()

const provinceController = require('../controllers/provinces')
router.post('/add', provinceController.addProvince)

router.get('/', provinceController.getProvinces)

router.get('/:id', provinceController.getProvince)

router.put('/', provinceController.updateProvince)

router.delete('/', provinceController.deleteProvince)

module.exports = router
