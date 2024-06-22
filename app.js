const express = require('express')
const path = require('path')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const app = express()
const dbPath = path.join(__dirname, 'covid19India.db')
let db = null
const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Port Running on 3000')
    })
  } catch (e) {
    console.log(`server error ${e}`)
  }
}
initializeDbAndServer()

const stateArray = eachItem => {
  return {
    state_id: eachItem.state_id,
    state_name: eachItem.state_name,
    population: eachItem.population,
  }
}

app.get('/states/', async (request, response) => {
  const listStates = `
    SELECT * FROM state
    `
  const arrStates = await db.all(listStates)
  response.send(arrStates.map(eachItem => stateArray(eachItem)))
})

app.get('/states/:stateId', async (request, response) => {
  const {stateId} = request.params
  const getState = `SELEC * FROM state WHERE state_id = ${stateId}`
  const arrState = await db.get(getState)
  response.send(stateArray(arrState))
})

app.post('/districts/', async (request, response) => {
  const districtDetails = request.body
  const {districName, stateId, cases, cured, active, deaths} = movieDetails
  const postDistrictQuery = `
    INSERT INTO DISTRICT(district_name, state_id, cases, cured, active)
    VALUES(
        '${districtName}',
        ${stateId},
        ${cases},
        ${active},
        ${deaths}
    )
    `
  const district = await db.run(postDistrictQuery)
  response.send('District Succesfully Added')
})

app.get('/districts/:districtId', async (request, response) => {
  const {districtId} = request.params
  const getDistrictQuery = `
    SELECT * FROM district WHERE district_id = ${districtId}
    `
  const arrayDistrict = await db.get(getDistrictQuery)
  response.send(stateArray(arrayDistrict))
})

app.delete('/districts/:districtId/', async (request, response) => {
  const {districtId} = request.params
  const deleteDistrictQuery = `
    DELETE FROM district WHERE district_id = ${districtId}`
  const deleteQuery = await db.run(deleteDistrictQuery)
  response.send('District Removed')
})

app.put('/districts/:districtId/', async (request, response) => {
  const districtDetails = request.body
  const {districtId} = request.params
  const {districtName, stateId, cases, cured, active, deaths} = districtDetails
  const updateDistrictQuery = `
  UPDATE district 
  SET 
  district_name = '${districName}',
  stateId = ${stateId},
  cases = ${cases},
  cured = ${cured},
  active = ${active},
  deaths = ${deaths}
  `
  const updateDistrict = await db.run(updateDistrictQuery)
  response.send('District Details Updated')
})

app.get('/states/:stateId/states/', async (request, response) => {
  const {stateId} = request.params
  const getStateQuery = `
    SELECT cases as totalCases, cured as totalCured, active as totalActive, deaths as totalDeaths FROM district WHERE state_id =
    ${stateId}
    `
  const getState = db.get(getStateQuery)
  response.send(stateArray(getState))
})

app.get('/districts/:districtId/details', async (request, response) => {
  const {districtId} = request.params
  const getDistrictQuery = `
    SELECT state_name as stateName FROM state INNER JOIN 
    district ON district.state_id = state.state_id
    `
    const getState = await db.get(getDistrictQuery)
    response.send(stateArray(getState))
})
