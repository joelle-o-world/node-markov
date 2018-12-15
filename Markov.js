class Markov {
  constructor(order) {
    this.order = order
    this.matrix = {}
    this.nullChar = ";"
  }

  getTable(antecedant) {
    var before = antecedant
    if(antecedant.length != this.order)
      if(antecedant.length < this.order) {
        if(antecedant.constructor == String)
          while(antecedant.length < this.order)
            antecedant = this.nullChar + antecedant
        else if(antecedant.constructor == Array)
          while(antecedant.length < this.order)
            antecedant.unshift(this.nullChar)
      } else {
        antecedant = antecedant.slice(antecedant.length-this.order)
      }

    var table = this.matrix
    for(var i in antecedant) {
      var lookup = antecedant[i]
      if(!table[lookup])
        table[lookup] = {}
      table = table[lookup]
    }
    return table
  }

  increment(antecedant, toIncrement, ammount) {
    ammount = ammount || 1

    var table = this.getTable(antecedant)

    table[toIncrement] = (table[toIncrement] || 0) + ammount
  }

  feed(stuff, amount) {
    if(stuff.length >= this.order)
    for(var i=0; i<stuff.length; i++) {
      var from = i>=this.order ? i-this.order : 0
      var antecedant = stuff.slice(from, i)
      var toIncrement = stuff[i]
      this.increment(antecedant, toIncrement, amount)
    }
    from = i>=this.order ? i-this.order : 0
    antecedant = stuff.slice(from, i)
    this.increment(antecedant, this.nullChar, amount)
    return this
  }

  roll(antecedant) {
    var table = this.getTable(antecedant)
    var sum = 0
    for(var i in table)
      sum += table[i]

    if(sum == 0) {
      antecedant
      return this.nullChar
    }

    var index = Math.random() * sum
    for(var i in table) {
      index -= table[i]
      if(index < 0)
        return i
    }
  }

  walk(stuff, n) {
    var next = this.roll(stuff)
    if(next == this.nullChar)
      return stuff
    if(stuff.constructor == Array)
      stuff.push(next)
    else if (stuff.constructor == String)
      stuff += next

    if(n > 1)
      return this.walk(stuff, n-1)
    else
      return stuff
  }

  getProbability(antecedant, next) {
    var table = this.getTable(antecedant)
    var sum = 0
    for(var i in table)
      sum += table[i]
    if(sum == 0)
      return 0
    return (table[next] || 0)/sum
  }

  evaluate(stuff) {
    var sum = 0
    for(var i=0; i<stuff.length; i++) {
      var from = i>=this.order ? i-this.order : 0
      var antecedant = stuff.slice(from, i)
      var next = stuff[i]
      sum += this.getProbability(antecedant, next)
    }
    return sum/stuff.length
  }

  get allTables() {
    var tables = Object.values(this.matrix)
    for(var i=0; i<this.order-1; i++)
      tables = [].concat.apply([], tables.map(tab => Object.values(tab)))

    return tables
  }
}
module.exports = Markov
