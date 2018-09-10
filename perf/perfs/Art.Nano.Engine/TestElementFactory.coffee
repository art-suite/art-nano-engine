"use strict"
{
  merge
  mergeInto
  isPlainObject
  isArray
} = require '../../StandardImport'

ElementClass = Neptune.Art.Nano.Engine.Element

__children = __oneProps = __props = null
__factoryAdd = (el) ->
  if el
    if isPlainObject el
      if __oneProps
        __props = merge __oneProps, el
        __oneProps = null

      else if __props
        mergeInto __props, el

      else
        __oneProps = el

    else if isArray el
      for subEl in el
        __factoryAdd subEl

    else
      __children ?= []
      __children.push el
  null

module.exports = ->
  __children = __oneProps = __props = null

  for arg in arguments
    __factoryAdd arg

  new ElementClass __oneProps || __props, __children
