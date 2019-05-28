import pixelWidth from 'string-pixel-width'

class SvgActor {
  constructor(name, layout, siblingL) {
    this.name = name
    this.layout = layout    
    this.siblingL = siblingL
    this.states = []
    this.transitions = {}
    this._halfLabelWidth = Math.floor(this.rawLabelWidth() / 2)
    this._centerX = this.centerX
  }

  get bodyHeight() {
    return this.layout.initBodyHeight - this.labelHeight
  }

  get bodyWidth() {
    return this.layout.halfBodyWidth * 2
  }

  get bodyX() {
    return this._centerX - this.layout.halfBodyWidth
  }
  
  get bodyY() {
    return this.centerY(0) + 10
  }

  get centerX() {
    return this.leftOffset + this._halfLabelWidth
  }

  centerY (relOffset) {
    return this.layout.topOffset + this.labelHeight + relOffset
  }

  get labelHeight() {
    return this.layout.fontSize + this.layout.topPad * 2
  }

  get labelWidth() {
    return this._halfLabelWidth * 2
  }

  rawLabelWidth (labelText=this.name) {
    let textWidth = Math.floor(pixelWidth(labelText, { size: this.layout.fontSize }))
    return this.layout.leftPad * 2 + textWidth
  }

  get labelX() {
    return this.leftOffset
  }

  get labelXOffset() {
    return this.layout.leftOffset + this._halfLabelWidth * 2
  }

  labelY (relOffset) {
    return this.layout.topOffset + relOffset
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

  get textX() {
    return this._centerX - this._halfLabelWidth  + this.layout.leftPad
  }

  textY (relOffset) {
    return this.layout.topOffset + this.layout.fontSize + relOffset + 2
  }

  spanLog(nextActor) {
    const _spanLog = {}
    const span = 0
    while (nextActor) {
      if (nextActor.siblingL)
        _spanLog[nextActor.siblingL.name] = nextActor.centerX - nextActor.siblingL.centerX
      nextActor = nextActor.siblingL
    }
    return _spanLog
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

