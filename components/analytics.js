app.component('analytics', {
  templateUrl: 'views/analytics.html',
  controller: AnalyticsCtrl
})

function AnalyticsCtrl($q) {
  this.reset = function () {
    analyticsDB.destroy()
      .then(() => {
        window.analyticsDB = new PouchDB('shahmadi:analytics')
        return this.reload()
      })
  }
  this.reload = function () {
    var analytics = analyticsDB.allDocs({include_docs: true})
      .then((res) => {
        return res.rows.map(row => row.doc)
      })
      .then((docs) => {
        return docs.reduce((memo, doc) => {
          var appear = memo.appear
          var correct = memo.correct

          switch (doc.type) {
          case 'appear':
            appear[doc.entry] = appear[doc.entry] || 0
            appear[doc.entry]++
            break
          case 'correct':
            correct[doc.entry] = correct[doc.entry] || 0
            correct[doc.entry]++
            break
          }
          return memo
        }, {appear: {}, correct: {}})
      })

    Promise.all([
      metaDB.allDocs({include_docs: true}),
      entryDB.allDocs({include_docs: true}),
      analytics,
    ]).then((res) => {
      this.meta = res[0].rows.map(i => i.doc)
      this.entries = res[1].rows.map(i => i.doc)
      this.analytics = res[2]
      return $q.resolve()
    })
  }
}
