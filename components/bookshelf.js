app.component('bookshelf', {
  templateUrl: 'views/bookshelf.html',
  controller: BookshelfCtrl,
  require: {
    shahmadi: '^'
  }
})

app.component('bookCreator', {
  templateUrl: 'views/book-creator.html',
  controller: BookCreatorCtrl,
  require: {
    bookshelf: '^'
  }
})

function BookshelfCtrl($q) {
  this.$onInit = function () {
    this.reload()
  }

  this.open = function (book) {
    this.shahmadi.open(book)
  }

  this.remove = function (book) {
    bookDB.remove(book)
      .then(() => {
        this.reload()
      })
  }

  this.update = function (item) {
    bookDB.put(item)
      .then(() => {
        this.reload()
      })
  }

  this.reload = function () {
    bookDB.allDocs({include_docs: true})
      .then((result) => {
        this.books = result.rows.map(i => i.doc)
        return $q.resolve()
      })
  }
}

function BookCreatorCtrl() {
  this.create = function (title) {
    if (!title) return
    this.title = undefined
    bookDB.post({title})
      .then(() => {
        this.bookshelf.reload()
      })
  }
}
