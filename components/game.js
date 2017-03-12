app.component('game', {
  templateUrl: 'views/game.html',
  controller: GameCtrl,
  bindings: {
    book: '@'
  }
})

function GameCtrl($q, $rootScope) {

  $rootScope.$on('metachange', () => {
    this.state = 'pick'
    this.meta = undefined
    this.entry = undefined
  })

  this.$onInit = function () {
    this.state = 'pick'
  }

  this.skip = function () {
    this.pick()
  }

  this.answer = function () {
    this.state = 'answer'
  }

  this.correct = function (entry) {
    this.pick()
    this.state = 'question'
    analyticsDB.post({
      type: 'correct',
      entry: entry._id
    })
  }

  this.wrong = function () {
    this.pick()
    this.state = 'question'
  }

  this.pick = function () {

    var meta = metaDB.allDocs({include_docs: true})
      .then((res) => {
        return res.rows.map(row => row.doc)
      })

    var entry = entryDB.find({
      selector: {book: this.book}
    }).then((res) => {
      var index = Math.floor(Math.random() * res.docs.length)
      return res.docs[index]
    })

    Promise.all([meta, entry])
      .then((res) => {
        this.meta = res[0]
        this.entry = res[1]
        this.state = 'question'
        analyticsDB.post({
          type: 'appear',
          entry: this.entry._id
        })
        return $q.resolve()
      })
  }
}
