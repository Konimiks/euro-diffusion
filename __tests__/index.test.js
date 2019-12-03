describe('diffusion unit tests', () => {
    it('returns correct result for dataset1', () => {
        const getOutput = require('../src/index')
        return getOutput('./data/dataset1').then(res => {
            expect(res).toEqual([
                {
                    Spain: 382,
                    Portugal: 416,
                    France: 1325 
                }, {
                    Luxembourg: 0
                }, {
                    Belgium: 2, 
                    Netherlands: 2
                }
            ])
        })
    })
    it('returns list of errors for dataset2', () => {
        const getOutput = require('../src/index')
        return getOutput('./data/dataset2').then(res => {
            expect(res).toEqual([
               new Error('Wrong params for France: 5,7,4,6')
            ])
        })
    })
    it('returns empty list for dataset3', () => {
        const getOutput = require('../src/index')
        return getOutput('./data/dataset3').then(res => {
            expect(res).toEqual([])
        })
    })
})