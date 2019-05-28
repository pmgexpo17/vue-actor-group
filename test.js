import { equal } from 'assert'
import pixelWidth from 'string-pixel-width'
import factory from './index'

const actorName = ['SvgActor1','SvgActor2','SvgActor3']

const layout = {
  arrowHeadSize: 7,
  fontSize: 16,  
  halfBodyWidth: 10,
  initBodyHeight: 180,
  leftOffset: 40,
  leftPad: 5,
  topOffset: 20,
  topPad: 5,
  strokeWidth: 2
}

describe('vue-actor-group', function () {

  factory.setLayout(layout)
  let actor1 = factory.new(actorName[0])
  let actor2 = factory.new(actorName[1], actor1)
  console.log('name : '  + actor2.name + ' , sibling : ' + actor2.siblingL.name)
  let actor = factory.new(actorName[2], actor2)
  console.log('name : '  + actor.name + ' , sibling : ' + actor.siblingL.name)
  console.log(actor.name + ' , halfLabelWidth : ' + actor._halfLabelWidth)
  let labelWidth = layout.leftPad * 2 + Math.floor(pixelWidth(actor.name, { size: layout.fontSize }))
  let labelHeight = layout.fontSize + layout.topPad * 2
  let leftOffset = layout.leftOffset + actor2.labelXOffset + actor1.labelXOffset
  let centerX = leftOffset + Math.floor(labelWidth / 2)
  let centerY = layout.topOffset + labelHeight

  it('should create a new actor', function () {
    equal(actor.name, actorName[2])
  })

  it('should calculate svg arrow start x', function () {
    equal(actor.arrowX1, actor._centerX + layout.halfBodyWidth)
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
    equal(actor.labelXOffset, layout.leftOffset + labelWidth)
  })

  it('should calculate svg actor labelY', function () {
    equal(actor.labelY(0), layout.topOffset)
  })

  it('should calculate svg actor left offset', function () {
    equal(actor.leftOffset, leftOffset)
  })

  it('should calculate svg actor textX', function () {
    const textX = centerX - Math.ceil(labelWidth / 2) + layout.leftPad
    equal(actor.textX,  textX)
  })

  it('should calculate svg actor textY', function () {
    const textY = layout.topOffset + layout.fontSize + 2
    equal(actor.textY(0), textY)
  })
})
