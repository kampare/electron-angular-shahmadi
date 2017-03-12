app.component('entryCreator', {
  templateUrl: 'views/entry-creator.html',
  controller: EntryCreatorCtrl,
  require: {
    book: '^'
  }
})

app.component('book', {
  templateUrl: 'views/book.html',
  controller: BookCtrl,
  bindings: {
    book: '@'
  },
  require: {
    shahmadi: '^'
  }
})

function EntryCreatorCtrl($q, $rootScope) {
  $rootScope.$on('metachange', () => {
    this.reload()
  })

  this.$onInit = function () {
    this.reload()
  }

  this.create = function (entry) {
    if (!entry) return
    this.entry = undefined
    entry.book = this.book.book
    entryDB.post(entry)
      .then(() => {
        this.book.reload()
      })
  }

  this.reload = function () {
    metaDB.allDocs({include_docs: true})
      .then((result) => {
        this.meta = result.rows.map(i => i.doc)
        return $q.resolve()
      })
  }
}

function BookCtrl($q, $rootScope) {

  $rootScope.$on('metachange', () => {
    this.reload()
  })

  this.$onChanges = function () {
    this.reload()
  }

  this.$onInit = function () {
    this.reload()
  }

  this.close = function () {
    this.shahmadi.close()
  }

  this.remove = function (entry) {
    entryDB.remove(entry)
      .then(() => {
        this.reload()
      })
  }

  this.update = function (entry) {
    entryDB.put(entry)
      .then(() => {
        this.reload()
      })
  }

  this.reload = function () {
    var entries = entryDB.find({
      selector: {book: this.book}
    }).then((res) => {
      console.log(res);
      return res.docs
    })

    Promise.all([
      metaDB.allDocs({include_docs: true}),
      // entryDB.allDocs({include_docs: true}),
      entries
    ]).then((res) => {
      this.meta = res[0].rows.map(i => i.doc)
      // this.entries = res[1].rows.map(i => i.doc)
      // console.log(res[1]);
      this.entries = res[1]
      return $q.resolve()
    })
  }
}
