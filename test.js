import { equal } from 'assert'
import pixelWidth from 'string-pixel-width'
import factory from './index'

const actorName = ['SvgActor1','SvgActor2','SvgActor3']

const layout = {
  arrowHeadSize: 7,
  fillColor: 'lightyellow',
  font: 'courier new',
  fontSize: 16,  
  halfBodyWidth: 10,
  initBodyHeight: 180,
  leftMargin: 40,
  leftPad: 5,
  topMargin: 20,
  topPad: 5,
  strokeWidth: 2
}

const packet1 = {
  actorFrom: 'SvgActor1',
  programIndex: 0,
  type: 'state',
  value: 'STATE_ONE',
}

const packet2 = {
  actorFrom: 'SvgActor1',
  actorTo: 'SvgActor2',
  programIndex: 0,
  type: 'state',
  value: 'calling actor2 micro-service ...',
}

describe('vue-actor-group', function () {

  factory.setLayout(layout)
  let actor1 = factory.new(actorName[0])
  let actor2 = factory.new(actorName[1])
  console.log('name : '  + actor2.name + ' , sibling : ' + actor2.prev.name)  
  let actor = factory.new(actorName[2])
  console.log('name : '  + actor.name + ' , sibling : ' + actor.prev.name)
  let halfLabelWidth = layout.leftPad + Math.round(pixelWidth(actor.name, { font: layout.font, size: layout.fontSize }) / 2)
  console.log(actor.name + ' , halfLabelWidth : ' + halfLabelWidth)  
  let labelWidth = halfLabelWidth * 2
  let labelHeight = layout.fontSize + layout.topPad * 2
  let leftOffset = Math.round(layout.leftMargin * 2.5) + labelWidth + labelWidth
  let centerX = leftOffset + halfLabelWidth
  let centerY = layout.topMargin + labelHeight

  it('should create a new actor', function () {
    equal(actor.name, actorName[2])
  })

  it('should calculate svg center x', function () {
    equal(actor.centerX, centerX)
  })

  it('should calculate svg arrow start x', function () {
    equal(actor.arrowX1, centerX + layout.halfBodyWidth)
  })

  it('should calculate svg actor body height', function () {
    const bodyHeight = layout.initBodyHeight - (layout.fontSize + layout.topPad * 2)
    equal(actor.bodyHeight, bodyHeight)
  })

  it('should calculate svg actor body width', function () {
    equal(actor.bodyWidth, layout.halfBodyWidth * 2)
  })

  it('should calculate svg actor bodyX', function () {
    equal(actor.bodyX, centerX - layout.halfBodyWidth)
  })

  it('should calculate svg actor bodyY', function () {
    equal(actor.bodyY, centerY + 10)
  })

  it('should calculate svg actor centerX', function () {
    equal(actor.centerX, centerX)
  })

  it('should calculate svg actor centerY', function () {
    equal(actor.centerY(0), centerY)
  })

  it('should calculate svg actor label height', function () {
    equal(actor.labelHeight, labelHeight)
  })

  it('should calculate svg actor label width', function () {
    equal(actor.labelWidth, labelWidth)
  })

  it('should calculate svg actor labelX', function () {
    equal(actor.labelX, leftOffset)
  })

  it('should calculate svg actor labelXOffset', function () {
    equal(actor.labelXOffset(), layout.leftMargin + labelWidth)
  })

  it('should calculate svg actor labelY', function () {
    equal(actor.labelY(0), layout.topMargin)
  })

  it('should calculate svg actor left offset', function () {
    equal(actor.leftOffset(actor1), leftOffset)
  })

  it('should calculate svg actor textX', function () {
    const textX = centerX - halfLabelWidth + layout.leftPad
    equal(actor.textX,  textX)
  })

  it('should calculate svg actor textY', function () {
    const textY = layout.topMargin + layout.fontSize + layout.topPad - layout.strokeWidth
    equal(actor.textY(0), textY)
  })

  it('should find a member by actorName', function () {
    equal(actor1.findMember('SvgActor2').name, 'SvgActor2')
  })

  it('should add a state artifact successfully', function () {
    const artifact = factory.addArtifact(packet1)[0]
    const bodyYOffset = actor1.bodyY + layout.topMargin
    equal(bodyYOffset, artifact.bodyYOffset)
  })

  it('should add a transition artifact successfully', function () {
    const artifact = factory.addArtifact(packet2)[1]
    const bodyYOffset = actor1.profile[0].bodyYOffset + layout.topMargin + actor1.labelHeight
    equal(bodyYOffset, artifact.bodyYOffset)
  })

})
