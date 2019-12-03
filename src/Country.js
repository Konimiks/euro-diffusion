class Country {
    constructor (name, southWestCity, northEastCity) {
        this.name = name
        this.xl = southWestCity.x
        this.yl = southWestCity.y
        this.xh = northEastCity.x
        this.yh = northEastCity.y
        southWestCity.country = this
        northEastCity.country = this
        this.cities = [southWestCity, northEastCity]
        this.judgmentDay = -1
    }
}

module.exports = Country