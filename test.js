import { equal } from 'assert'
import pixelWidth from 'string-pixel-width'
import factory from './index'

const actorName = ['SvgActor1','SvgActor2','SvgActor3']

const defaultLayout = {
  leftOffset: 40,
  fontSize: 16,
  leftPad: 5,
  topOffset: 20,
  topPad: 5
}

describe('vue-actor-group', function () {

  let actor1 = factory.new(actorName[0], defaultLayout)
  let actor2 = factory.new(actorName[1], defaultLayout, actor1)
  console.log('name : '  + actor2.name + ' , sibling : ' + actor2.siblingL.name)
  let actor = factory.new(actorName[2], defaultLayout, actor2)
  console.log('name : '  + actor.name + ' , sibling : ' + actor.siblingL.name)
  let labelWidth = defaultLayout.leftPad * 2 + pixelWidth(actorName[2], { size: defaultLayout.fontSize })
  let labelHeight = defaultLayout.fontSize + defaultLayout.topPad * 2
  let labelXOffset = defaultLayout.leftOffset + labelWidth
  let textPosX = defaultLayout.leftOffset + defaultLayout.leftPad
  let textPosY = defaultLayout.topOffset + defaultLayout.topPad + defaultLayout.fontSize

  it('should create a new actor', function () {
    equal(actor.name, actorName[2])
  })

  it('should calculate svg label width', function () {
    equal(actor.labelWidth, labelWidth)
  })

  it('should calculate svg label height', function () {
    equal(actor.labelHeight, labelHeight)
  })

  it('should calculate svg label left offset', function () {
    equal(actor.labelXOffset, labelXOffset)
  })

  it('should calculate svg left offset', function () {
    equal(actor.leftOffset, defaultLayout.leftOffset)
  })

  it('should calculate svg top offset', function () {
    equal(actor.topOffset, defaultLayout.topOffset)
  })

  it('should calculate svg label text pos x', function () {
    equal(actor.textPosX, textPosX)
  })

  it('should calculate svg label text pos y', function () {
    equal(actor.textPosY, textPosY)
  })

})
