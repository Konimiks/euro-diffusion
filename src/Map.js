const City = require('./City');
const { areInBounds, findCityByCoordinates } = require('./utils');
const arraySizeTen = 10;

class Map {
    constructor() {
        this.cities = []
        this.countries = []
        this.neighbours = {}
        this.result = {}
        this.grid = this.makeGrid()
    }
    makeGrid () {
        const grid = new Array(arraySizeTen);
        for (let i = 0; i < grid.length; i++) {
            grid[i] = new Array(arraySizeTen);
        }
        return grid;
    }

    init () {
        this.buildNeighbours()
        this.setInitialBalances()
    }

    buildNeighbours () {
        this.cities.map((city) => {
            const {x, y} = city;
            if(this.westernCityExists(x, y))
                city.addNeighbour(findCityByCoordinates(this.cities, x-1, y));
            if(this.easternCityExists(x, y))
                city.addNeighbour(findCityByCoordinates(this.cities, x+1, y));
            if(this.northernCityExists(x, y))
                city.addNeighbour(findCityByCoordinates(this.cities, x, y+1));
            if(this.southernCityExists(x, y))
                city.addNeighbour(findCityByCoordinates(this.cities, x, y-1));
        })
    }

    westernCityExists (x, y) {
        return areInBounds(x, y) && this.grid[x-1][y] != 0
    }
    easternCityExists (x, y) {
        return areInBounds(x, y) && this.grid[x+1][y] != 0
    }
    northernCityExists (x, y) {
        return areInBounds(x, y) && this.grid[x][y+1] != 0
    }
    southernCityExists (x, y) {
        return areInBounds(x, y) && this.grid[x][y-1] != 0
    }

    setInitialBalances () {
        this.cities.map(city => city.setBalances(this.countries))
    }

    performTransaction (from, to, countryName) {
        to.receiveIncome(countryName, from.pay(countryName))
    }

    initializeIncomes () {
        this.cities.map(city => city.setBalances(this.countries))
    }

    isJudgmentDay (day) {
        this.countries.map(country => {
            if (country.judgmentDay < 0)
             country.judgmentDay = day
        })
        return this.cities.reduce((acc, city) => {
            if(!city.checkReadyStatus(this.countries)) {
                city.country.judgmentDay = -1
                return acc && false
            } else {
                return acc
            }
        }, true)
    }

    performDiffusion () {
        if (this.countries.length === 1) {
            return {
                [this.countries[0].name]: 0
            }
        }
        this.init()
        let day = 0;
        do {
            this.morning()
            this.day()
            this.evening()
            day++;
        } while(!this.isJudgmentDay(day))
        return this.getDiffusionResult()
    }

    morning () {
        this.cities.map(city => city.countOutcome())
    }

    day () {
        this.performTransactions()
    }

    evening() {
        this.cities.map(city => {
            city.incomeToCurrent()
            city.flushIncome()
        })
    }

    addCountry (country) {
        const countryId = this.countries.length + 1
        this.countries.push(country)
        for (let y=country.yl; y <= country.yh; y++) {
            for (let x=country.xl; x <= country.xh; x++) {
                const newCity = new City(x, y)
                newCity.country = country
                this.cities.push(newCity)
                this.grid[x][y]=countryId
            }
        }

    }

    performTransactions() {
        this.cities.map(city =>
            city.neighbours.map(neighbour =>
                this.countries.map(country =>
                    this.performTransaction(city, neighbour, country))))
    }

    performTransaction(from, to, country) {
        to.receiveIncome(country.name, from.pay(country.name))
    }

    getDiffusionResult() {
        let res = this.countries.reduce((acc, country) => Object.assign(acc, {[country.name]: country.judgmentDay}), {})
        return res
    }
}

module.exports = Map