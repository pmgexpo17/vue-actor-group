import pixelWidth from 'string-pixel-width'

class SvgActor {
  constructor(name, first, layout=null) {
    this.name = name
    this.prev = null
    this.prevArtifact = null
    this.profile = []
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

  evalCenterX(first) {
    if (!first) 
      first = this
    return this.leftOffset(first) + this.halfLabelWidth
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
    return this.centerX - this.halfLabelWidth
  }

  labelXOffset(isFirst=false) {    
    return (isFirst) ? Math.round(this.layout.leftMargin / 2) : this.layout.leftMargin + this.labelWidth
  }

  labelY (relOffset) {
    return this.layout.topMargin + relOffset
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

  textY (relOffset) {
    return this.layout.topMargin + this.layout.fontSize + this.layout.topPad - this.layout.strokeWidth + relOffset
  }

  arrowCoords(packet) {
    let actorTo = this.findMember(packet.actorTo)
    let arrowCoords = {}
    const arrowSign = actorTo.centerX < this.centerX ? -1 : 1
    arrowCoords.arrowX1 = actorFrom.centerX + (arrowSign * this.layout.halfBodyWidth)
    const adjustX = this.layout.halfBodyWidth + this.layout.arrowHeadSize + this.layout.strokeWidth
    arrowCoords.arrowX2 = actorTo.centerX - (arrowSign * adjustX)
    const textWidth = this.evalTextWidth(packet.value)
    const textSpan = Math.abs(actorTo.centerX - this.centerX) - this.layout.halfBodyWidth * 2
    const leftPad = Math.round((textSpan - textWidth) / 2)
    arrowCoords.arrowTextX = leftPad + this.layout.halfBodyWidth
    arrowCoords.arrowTextX += (arrowSign < 1) ? actorTo.centerX  : this.centerX
    return arrowCoords
  }

  addArtifact(packet) {
    let artifact = {            
      index: packet.programIndex,
      actorFrom: this.name,
      bodyYOffset: (this.prevArtifact) ? this.prevArtifact.bodyYOffset : this.bodyY,
      type: packet.type,
      value: packet.value
    }
    if (packet.type == 'transition')
        Object.assign(artifact, state.arrowCoords(packet.value))
    artifact.bodyYOffset += this.layout.topMargin
    if (this.prevArtifact)
      artifact.bodyYOffset += this.labelHeight
    this.prevArtifact = artifact
    this.profile.push(artifact)
    return this.profile
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
  setLayout(layout) {
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
  }
}

export default factory

