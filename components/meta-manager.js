app.component('metaManager', {
  templateUrl: 'views/meta-manager.html',
  controller: MetaCtrl
})

app.component('metaCreator', {
  templateUrl: 'views/meta-creator.html',
  controller: MetaCreatorCtrl
})

function MetaCreatorCtrl($rootScope) {
  this.create = function (name, face, mask) {
    if (!name) return
    this.name = undefined
    metaDB.post({name, face, mask})
      .then(() => {
        $rootScope.$emit('metachange')
      })
  }
}

function MetaCtrl($q, $rootScope) {

  $rootScope.$on('metachange', () => {
    this.reload()
  })

  this.$onInit = function () {
    this.reload()
  }

  this.remove = function (item) {
    metaDB.remove(item)
      .then(() => {
        $rootScope.$emit('metachange')
      })
  }

  this.update = function (item) {
    metaDB.put(item)
      .then(() => {
        $rootScope.$emit('metachange')
      })
  }

  this.reload = function () {
    metaDB.allDocs({include_docs: true})
      .then((result) => {
        this.items = result.rows.map(i => i.doc)
        return $q.resolve()
      })
  }
}
