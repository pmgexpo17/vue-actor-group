import pixelWidth from 'string-pixel-width'

class SvgActor {
  constructor(name, layout, siblingL) {
    this.name = name
    this.layout = layout
    this.siblingL = siblingL
    this.states = []
    this.transitions = {}
    this._leftOffset = 0 // stores computed value
  }

  get labelWidth() {
    let textWidth = Math.ceil(pixelWidth(this.name, { size: this.layout.fontSize }))
    console.log('textWidth : ' + textWidth)
    return this.layout.leftPad * 2 + textWidth
  }

  get labelHeight() {
    return this.layout.fontSize + this.layout.topPad * 2
  }

  get labelXOffset() {
    return this.layout.leftOffset + this.labelWidth
  }

  get leftOffset() {
    let leftOffset = this.layout.leftOffset
    let nextActor = this.siblingL
    while (nextActor) {
      leftOffset += nextActor.labelXOffset
      nextActor = nextActor.siblingL
    }
    this._leftOffset = leftOffset
    return leftOffset
  }

  get topOffset() {
    return this.layout.topOffset
  }

  get textPosX() {
    let leftOffset = this._leftOffset
    this._leftOffset = 0
    return leftOffset + this.layout.leftPad
  }

  get textPosY() {
    return this.topOffset + this.layout.topPad + this.layout.fontSize
  }
}

let factory = {
  /*
   * SvgActor factory
   */
  new: function(name, layout, siblingL=null) {  
    return new SvgActor(name, layout, siblingL)
  }
}

export default factory

