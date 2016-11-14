const DB = require('nedb')
const _ = require('lodash')
const util = require('util')
const Promise = require('bluebird')
const S = require('string')
const cp = require('child_process')
const fs = require('fs-extra')
const through2 = require('through2')
const prettyBytes = require('pretty-bytes')
const moment = require('moment')
Promise.promisifyAll(DB.prototype)

// let sss = [ { url: 'http://cs.odu.edu', jobId: 1473098189935 },
//   { url: 'http://matkelly.com', jobId: 1473828972667 },
//   { url: 'http://matkelly.com', jobId: 1473828972667 },
//   { url: 'http://matkelly.com', jobId: 1473828972667 },
//   { url: 'http://matkelly.com', jobId: 1473828972667 },
//   { url: 'http://matkelly.com', jobId: 1473828972667 },
//   { url: 'cs.odu.edu/~jberlin', jobId: 1475010467129 },
//   { url: 'cs.odu.edu/~jberlin', jobId: 1475012345753 },
//   { url: 'cs.odu.edu/~jberlin', jobId: 1475014488646 },
//   { url: 'cs.odu.edu/~jberlin', jobId: 1475014754339 },
//   { url: 'cs.odu.edu', jobId: 1475473536070 } ]
//
// let trans = _.chain(sss)
//   .groupBy(it => it.url)
//   .mapValues(ar => {
//     let it = ar.map(it => it.jobId)
//     let jobIds = _.uniq(it)
//     return {
//       mementos: it.length,
//       jobIds
//     }
//   })
//   .toPairs()
//   .flatMap(it => {
//     return {
//       url: it[ 0 ],
//       jobIds: it[ 1 ].jobIds,
//       mementos: it[ 1 ].mementos
//     }
//   }).value()
// console.log(util.inspect(trans, { colors: true, depth: null }))

console.log('hi')
const a = new DB({
  filename: '/home/john/my-fork-wail/dev_coreData/database/archives.db',
  autoload: true
})

const c = new DB({
  filename: '/home/john/my-fork-wail/dev_coreData/database/crawls.db',
  autoload: true
})

// c.find({}, (err, runs) => {
//   console.log(util.inspect(runs, { depth: null, colors: true }))
// })

function *updateGen (col) {
  for (let it of col)
    yield it
}

const transformSeeds = seeds => _.chain(seeds)
  .groupBy(it => it.url)
  .mapValues(ar => {
    let it = ar.map(it => it.jobId)
    let jobIds = _.uniq(it)
    return {
      mementos: it.length,
      jobIds
    }
  })
  .toPairs()
  .flatMap(it => {
    return {
      url: it[ 0 ],
      jobIds: it[ 1 ].jobIds,
      mementos: it[ 1 ].mementos
    }
  }).value()

let newCols = []
const update = (iter, collections, runs) => {
  let { done, value: col } = iter.next()
  if (!done) {
    runs.find({ forCol: col.colName }, (err, colRuns) => {
      if (colRuns.length > 0) {
        let seeds = []
        let rms = []
        colRuns.forEach(cur => {
          if (Array.isArray(cur.urls)) {
            cur.urls.forEach(it => {
              seeds.push({
                url: it,
                jobId: cur.jobId
              })
            })
          } else {
            seeds.push({
              url: cur.urls,
              jobId: cur.jobId
            })
          }
          if (cur.runs.length > 0) {
            rms = rms.concat(cur.runs.map(r => moment(r.timestamp)))
          }
        })
        col.lastUpdated = rms.length > 0 ? moment.max(rms).format() : moment().format()
        col.seeds = transformSeeds(seeds)
      } else {
        col.lastUpdated = moment().format()
        col.seeds = []
      }
      col.created = moment().format()
      let size = 0
      fs.walk(col.archive)
        .pipe(through2.obj(function (item, enc, next) {
          if (!item.stats.isDirectory()) this.push(item)
          next()
        }))
        .on('data', item => {
          size += item.stats.size
        })
        .on('end', () => {
          col.size = prettyBytes(size)
          delete col.crawls
          newCols.push(col)
          update(iter, collections, runs)
        })
    })
  } else {
    console.log(util.inspect(newCols, { depth: null, colors: true }))
    a.remove({}, { multi: true }, (x, y) => {
      a.insert(newCols, (erri, newDocs) => {
        console.log(newDocs)
      })
    })
  }
}

a.find({}, (err, collections) => {
  console.log(util.inspect(collections, { depth: null, colors: true }))
  // update(updateGen(collections), a, c)
  // collections.forEach(col => {
  //   c.find({ forCol: col.colName }, (err, colRuns) => {
  //     console.log(util.inspect(col, { depth: null, colors: true }))
  //     console.log(util.inspect(colRuns, { depth: null, colors: true }))
  //     if (colRuns.length > 0) {
  //       let seeds = colRuns.map(r => r.urls)
  //       console.log(seeds)
  //     } else {
  //       console.log('no seeds')
  //       a.update({ _id: col._id },)
  //     }
  //     console.log('------------------------------')
  //   })
  // })
})