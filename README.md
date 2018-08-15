BASIC:
animateOnCreation:          boolean
key:                        string
cacheThrough:               boolean (DEPRICATED?)
cacheDraw:                  boolean
clip:                       boolean
angle:                      number
inFlow:                     boolean (rename: forceLayout)
layoutWeight:               number (row/column flex-layout)
visible:                    boolean # DEPRICATED < let's just do opacity
opacity:                    boolean
pointerEventPriority:       number

SIMPLE INLINE
childrenAlignment:          Point
axis:                       Point
currentLocation:            Point
currentSize:                Point
currentPadding:             Perimeter
currentMargin:              Perimeter
elementToParentMatrix:      Matrix

INLINE:
size:                       PointLayout (may contain custom functions)
location:                   PointLayout (may contain custom functions)
scale:                      function or Point
padding:                    function or Perimeter
childrenMargins:            function or Perimeter
margin:                     function or Perimeter

ENUMERATE:
stage:                      true/false/null (null == auto)
childrenLayout:             enumerated, null == disabled
cursor:                     enumerated
receivePointerEvents:       function or enumerated-functions
childArea:                  function or enumerated-functions
compositeMode:              enumerated

willConsumeKeyboardEvent:   could-be: function or enumerated-strings:
    beforeAncestors
    beforeDescendents
    beforeAncestorsNoBrowserDefault
    beforeDescendentsNoBrowserDefault

  Currently:
    object:
      order:                  enumerated (beforeAncestors/beforeDescendents)
      allowBrowserDefault:    boolean
    function-returning-object
    or enumerated (beforeAncestors/beforeDescendents)

COMPLEX:
animators:                  animators-map
draw:                       draw-commands
                            We could make this a little assembly-language:
                              - list of enumerated command-types
                              - commands can have parameters - rectangles, colors, functions...
                              - 3 arrays?
                                * commands
                                * floats (rectangles, colors, etc)
                                * functions/other non-float values
                              - although, if we add PointLayout capabilities, and if we
                                add shape-commands to the list, we probably don't need functions.
                                then we could just have two arrays...
                                How does WEBASM handle floats???

NO CHANGE
parent
on:                         handlers-map
children:                   ... we could reserve, say, a 5-slot inline list of children...
userProps:                  any old object; not interpreted by ArtEngine (DEPRICATE?)

----------

Reduced Element Types:

Element
  Ideally I'd like to include TextElement's capabilities AND BitmapElement's.

  TextElement
    Has a bunch of extra props. Do we really want every element to have all of these?
      - Many are animatable...

    NEW: we want Span capabilities...
      - Span props should be animatable... (color...)
      Spans should probably be "children" elements.
      It might be nice if "text" was just a string child element - the simplest span.

ScrollElement
  Would then be the only alt element type!

TextInputElement