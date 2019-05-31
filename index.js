import pixelWidth from 'string-pixel-width'

class SvgActor {
  constructor(name, siblingL, layout=null) {
    this.name = name
    this.siblingL = siblingL
    this.states = []
    this.transitions = {}
    if (layout) this.layout = layout
    this.halfLabelWidth = this.evalHalfLabelWidth()
    this.centerX = this.evalCenterX
  }

  get arrowX1() {
    return this.centerX + this.layout.halfBodyWidth
  }

  get bodyHeight() {
    return this.layout.initBodyHeight - this.labelHeight
  }

  get bodyHeight() {
    return this.layout.initBodyHeight - this.labelHeight
  }

  get bodyWidth() {
    return this.layout.halfBodyWidth * 2
  }

  get bodyX() {
    return this.centerX - this.layout.halfBodyWidth
  }
  
  get bodyY() {
    return this.centerY(0) + 10
  }

  get evalCenterX() {
    return this.leftOffset + this.halfLabelWidth
  }

  centerY (relOffset) {
    return this.layout.topMargin + this.labelHeight + relOffset
  }

  get labelHeight() {
    return this.layout.fontSize + this.layout.topPad * 2
  }

  get labelWidth() {
    return this.halfLabelWidth * 2
  }

  evalTextWidth (labelText) {
    return pixelWidth(labelText, { font: this.layout.font, size: this.layout.fontSize })
  }

  evalHalfLabelWidth (labelText=this.name) {
    let textWidth = pixelWidth(labelText, { font: this.layout.font, size: this.layout.fontSize })
    return this.layout.leftPad + Math.round(textWidth / 2)
  }

  get labelX() {
    return this.leftOffset
  }

  get labelXOffset() {
    return this.layout.leftMargin + this.labelWidth
  }

  labelY (relOffset) {
    return this.layout.topMargin + relOffset
  }

  get leftOffset() {
    let leftOffset = Math.round(this.layout.leftMargin / 2)
    let nextActor = this.siblingL
    while (nextActor) {
      leftOffset += nextActor.labelXOffset
      nextActor = nextActor.siblingL
    }
    return leftOffset
  }

  get textX() {
    return this.centerX - this.halfLabelWidth  + this.layout.leftPad
  }

  textY (relOffset) {
    return this.layout.topMargin + this.layout.fontSize + this.layout.topPad - this.layout.strokeWidth + relOffset
  }
}

/*
  * SvgActor factory
  */
let factory = {
  // use prototype instead of a static property, set at startup
  setLayout: function(layout) {
    SvgActor.prototype.layout = layout
  },

  new: function(name, siblingL=null, layout=null) {  
    return new SvgActor(name, siblingL, layout)
  }
}

export default factory

