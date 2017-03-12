app.component('shahmadi', {
  templateUrl: 'views/shahmadi.html',
  controller: ShahmadiCtrl
})

function ShahmadiCtrl($rootScope) {
  this.open = function (book) {
    this.book = book
  }

  this.close = function () {
    this.book = undefined
  }
}
