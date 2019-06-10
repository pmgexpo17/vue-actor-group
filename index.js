import pixelWidth from 'string-pixel-width'

class SvgActor {
  constructor(name, first, layout=null) {
    this.name = name
    this.prev = null
    if (layout) this.layout = layout
    this.__init(first)
  }

  __init(first) {
    if (first) {
      let last = first.prev
      this.prev = (last) ? last : first  
      first.prev = this
    }
    this.halfLabelWidth = this.evalHalfLabelWidth()
    console.log('actor, labelwidth : ',this.name, this.labelWidth)
    this.centerX = this.evalCenterX(first)
  }

  get arrowX1() {
    return this.centerX + this.layout.halfBodyWidth
  }

  bodyHeight(factor=1) {
    return (factor * this.layout.initBodyHeight)
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

  evalCenterX(first) {
    if (!first) 
      first = this
    return this.leftOffset(first) + this.halfLabelWidth
  }

  centerY(factor=0) {
    let centerYTop = this.layout.topMargin + this.labelHeight
    return (factor == 0) ? centerYTop : centerYTop + this.bodyHeight(factor) + 20
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
    return this.centerX - this.halfLabelWidth
  }

  labelXOffset(isFirst=false) {    
    return (isFirst) ? Math.round(this.layout.leftMargin / 2) : this.layout.leftMargin + this.labelWidth
  }

  labelY(factor=0) {
    return (factor == 0) ? this.layout.topMargin : this.centerY(factor)
  }

  leftOffset(first) {
    let leftOffset = 0
    let nextActor = this
    // special case, when this == first, prev == null
    while (nextActor != first) {
      leftOffset += nextActor.prev.labelXOffset()
      nextActor = nextActor.prev
    }
    leftOffset += nextActor.labelXOffset(true)
    return leftOffset
  }

  get textX() {
    return this.centerX - this.halfLabelWidth  + this.layout.leftPad
  }

  textY(factor=0) {
    return this.labelY(factor) + this.layout.fontSize + this.layout.topPad - this.layout.strokeWidth
  }

  arrowCoords(packet) {
    let actorTo = this.findMember(packet.actorTo)
    let arrowCoords = {}
    const arrowSign = actorTo.centerX < this.centerX ? -1 : 1
    arrowCoords.arrowX1 = this.centerX + (arrowSign * this.layout.halfBodyWidth)
    const adjustX = this.layout.halfBodyWidth + this.layout.arrowHeadSize + this.layout.strokeWidth
    arrowCoords.arrowX2 = actorTo.centerX - (arrowSign * adjustX)
    // A transition can span multiple actors. ArrowTextX leftpad is derived from a single span
    // to avoid printing text that overlaps the body of an in-between actor
    let centerXSpan = (arrowSign < 1) ? this.centerX - this.prev.centerX : actorTo.centerX - actorTo.prev.centerX
    arrowCoords.arrowTextX = this.arrowTextX(packet, centerXSpan)
    arrowCoords.arrowTextX += (arrowSign < 1) ? actorTo.centerX  : this.centerX
    return arrowCoords
  }

  arrowTextX(packet, centerXSpan) {
    const textWidth = this.evalTextWidth(packet.value)
    const textSpan = centerXSpan - this.layout.halfBodyWidth * 2
    const leftPad = Math.round((textSpan - textWidth) / 2)
    return leftPad + this.layout.halfBodyWidth
  }

  addArtifact(packet) {
    let artifact = Object.assign({}, packet)
    if (packet.type == 'transition')
        Object.assign(artifact, this.arrowCoords(packet))
    artifact.bodyYOffset += this.layout.topMargin
    // after the first item, add the labelHeight of the previous item
    if (packet.programIndex)
      artifact.bodyYOffset += this.labelHeight    
    // test if body space is exhausted by placement of this artifact
    const bodyYLimit = this.centerY(artifact.bodyHtFactor) - 20 - this.labelHeight
    if (artifact.bodyYOffset  > bodyYLimit)
      artifact.bodyHtFactor++
    return artifact
  }

  findMember(actorName) {
    if (this.name == actorName)
      return this
    let member = this.prev
    while (member.name != actorName && member.name != this.name)
      member = member.prev
    // TO DO : raise exception if name is not found
    // ie, loop stops because member.name == this.name && this.name != actorName
    return member 
  }
}

/*
  * SvgActor factory
  */
let factory = {
  first: null,

  // use prototype instead of a static property, set at startup
  setConfig(layout) {
    SvgActor.prototype.layout = layout
  },

  new(name, layout=null) {
    let actor = new SvgActor(name, this.first, layout)    
    // maintain a rotating actor list, ie, first.prev = last
    if (!this.first)
      this.first = actor
    return actor
  },

  addArtifact(packet) {
    if (!this.first)
      return []
    const actorFrom = this.first.findMember(packet.actorFrom)
    return actorFrom.addArtifact(packet)
  },

  reset() {
    this.first = null
  }
}

export default factory

