const map = require('./Map');
const fs = require('fs');
const Country = require('./Country');
const City = require('./City');
const Map = require('./Map');
const isInBounds = require('./utils').isInBounds;

const minCoordinate = 1;
const maxCoordinate = 10;

function compareChunkToString(chunk, string) {
    return Buffer.compare(chunk, Buffer.from(string)) === 0;
}

function getCountryParams (stream) {
    const params = [];
    let tmp = false;
    while (null !== (chunk = stream.read(1))) {
	    if (compareChunkToString(chunk, '-')) {
	        tmp = true;
		    continue;
        }
        if (compareChunkToString(chunk, ' ') || compareChunkToString(chunk, '\r'))
            continue;
        if (compareChunkToString(chunk, '\n'))
            break;
        if(Number.isInteger(+chunk))
            params.push(+chunk)
      }
    return params
}

function getCountryName (stream) {
    let name = '';
    while (null !== (chunk = stream.read(1))) {
        if (compareChunkToString(chunk, '\r'))
            continue;
        if (compareChunkToString(chunk, '\n'))
            continue;
        if (compareChunkToString(chunk, ' '))
            break;
        name = name.concat(chunk.toString())
      }
    return name
}

function areParamsValid (params) {
    if (!(Array.isArray(params) && params.length === 4)) return false;
    if (!params.reduce((acc, param) => acc && isInBounds(param), true)) return false;
    if (!(params[0] <= params[2])) return false;
    if (!(params[1] <= params[3])) return false;
    if (params[0] < minCoordinate || params[0] > maxCoordinate) return false;
	if (params[1] < minCoordinate || params[1] > maxCoordinate) return false;
	if (params[2] < minCoordinate || params[2] > maxCoordinate) return false;
	if (params[3] < minCoordinate || params[3] > maxCoordinate) return false;
	if (params[0] === params[2] && params[1] === params[3]) return false;
	return true
}

function processSingleCase(stream, countriesNumber) {
    const map = new Map()
    if(countriesNumber === 0) return {}
    for(let i=0; i<countriesNumber; i++) {
        const name = getCountryName(stream)
        const params = getCountryParams(stream)
        if(!areParamsValid(params)) {
            return new Error(`Wrong params for ${name}: ${params}`)
        }
        map.addCountry(new Country(name,
            new City (params[0], params[1]),
            new City (params[2], params[3])))
      }
    return map.performDiffusion()
}
function processStream (stream) {
    return new Promise(resolve => {
        const tests = []
        stream.on('readable', () => {
            let chunk;
            while (null !== (chunk = stream.read(1))) {
                let res = processSingleCase(stream, Number(chunk))
                if (!(Object.keys(res).length === 0 && res.constructor === Object))
                    tests.push(res)
                else break
            }
            resolve(tests)
          })
    })
}

async function getOutput (inputPath) {
    const readStream = fs.createReadStream(inputPath)
    return await processStream(readStream)
}

module.exports = getOutput