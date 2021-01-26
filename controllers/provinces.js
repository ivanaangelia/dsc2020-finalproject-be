var counter = 3
var provinces = [
    {
        name: "DKI Jakarta",
        recovered: 83338,
        death: 2120,
        positive: 98206,
        url: "/api/v1/provinces/1"
    },
    {
        name: "Jawa Timur",
        recovered: 43671,
        death: 3606,
        positive: 49801,
        url: "/api/v1/provinces/2"
    },
    {
    name: "Jawa Barat",
    recovered: 21371,
    death: 616,
    positive: 31907,
    url: "/api/v1/provinces/3"
    }
]

const addProvince = (req, res) => {
    counter += 1
    const {name, recovered, death, positive} = req.body
    res.json({status: true, message: 'Storing data success', stored: req.body})
    const province = [
        {
            name: name,
            recovered: recovered,
            death: death,
            positive: positive,
            url: "/api/v1/provinces/" + counter-1
        }
    ]
    provinces.data.push(province)
    // lalu add ke database
}
const getProvinces = (req, res) => {
    res.json({status: true, totalData: counter, message: "Fetching data success", data: provinces})
}

const getProvince = (req, res) => {
    var {id} = req.params
    id -= 1
    const province = [
        {
            name: provinces[id].name,
            recovered: provinces[id].recovered,
            death: provinces[id].death,
            positive: provinces[id].positive
        }
    ]
    res.json({status: true, stored: province})
}

const updateProvince = (req, res) => {
    var {id, name, recovered, death, positive} = req.body
    id -= 1
    const before = [
        {
            name: provinces[id].name,
            recovered: provinces[id].recovered,
            death: provinces[id].death,
            positive: provinces[id].positive
        }
    ]
    const after = [
        {
            name: name,
            recovered: recovered,
            death: death,
            positive: positive
        }
    ]
    res.json({status: true, message: 'Updating data success', before: before, after: after})
    // lalu update databasenya
}

const deleteProvince = (req, res) => {
    var {id} = req.body
    id -= 1
    const province = [
        {
            name: provinces[id].name,
            recovered: provinces[id].recovered,
            death: provinces[id].death,
            positive: provinces[id].positive
        }
    ]
    res.json({status: true, message: 'Destroy data success', stored: province})
    counter -= 1
    // lalu delete datanya di database
}

module.exports = {
    addProvince,
    getProvinces,
    getProvince,
    updateProvince,
    deleteProvince
}