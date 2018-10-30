# Art.Nano.Engine

## Goal

* Speed! 
* Maintain 99% of the current API and power

## Options

1. WebAsm
2. 100% ArrayBuffer for everything except custom functions and non-enumerated strings
3. Inline like hell, but still keep separate objects for each Element. << so far this seems like a win

I'm leaning towards option #3. It's the most maintainable and flexible, and probably still pretty performant. The goal is to reduce the number of objects to just the Elements and any custom functions. Some measurements suggest that could be as much as 10-12x reduction in current static objects (objects that exists to express a non-changing Element tree). The further goal is to eliminate all ArtAtomic objects generated dynamically in layout, drawing, and event handling.

## Strategies

The main goal is to reduce object-creation. Rough numbers suggest a 10x reduction should be in reach.

* Inline all props, inline all pending props
* Possibly inline small children-lists
* All computation should be done on the stack - no heap use for ArtAtomic related work.
* Though we will inline props, we still want the user-friendly API which is decidedly not INLINE. 
	* draw for example is some huge mess of arrays and objects and functions

### ArtReact

- If ArtReact is in a worker, it could pre-process most props into their inline-form BEFORE passing the update/create data back to the main-thread ensuring we truly reduce object creation on the main thread 10x.
- But, sometimes, ArtReact will be running on the main thread. For example: the Imikimi editor where we want to process pointer-events, through ArtFlux, through ArtReact, all within one frame-cycle. Should we consider an optional, ArtReact-friendly semi-inline API for performance here?

## Props Refactor

### BASIC

* animateOnCreation:          boolean
* key:                        string
* cacheThrough:               boolean (DEPRICATED?)
* cacheDraw:                  boolean
* clip:                       boolean
* angle:                      number
* inFlow:                     boolean (rename: forceLayout)
* layoutWeight:               number (row/column flex-layout)
* visible:                    boolean # DEPRICATED < let's just do opacity
* opacity:                    boolean
* pointerEventPriority:       number

### INLINE

* childrenAlignment:          Point
* axis:                       Point
* currentLocation:            Point
* currentSize:                Point
* currentPadding:             Perimeter
* currentMargin:              Perimeter
* elementToParentMatrix:      Matrix

#### Optional Custom Functions

* size:                       PointLayout (may contain custom functions)
* location:                   PointLayout (may contain custom functions)
* scale:                      function or Point
* padding:                    function or Perimeter
* childrenMargins:            function or Perimeter
* margin:                     function or Perimeter

### ENUMERATE

* stage:                      true/false/null (null == auto)
* childrenLayout:             enumerated, null == disabled
* cursor:                     enumerated
* compositeMode:              enumerated

#### Optional Custom Functions

* receivePointerEvents:       function or enumerated-functions
* childArea:                  function or enumerated-functions
* willConsumeKeyboardEvent:   function or enumerated

### COMPLEX

* animators:                  animators-map
* draw:                       draw-commands

For draw, We could make this a little assembly-language:
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

### NO CHANGE

* parent
* on:                         handlers-map
* children:                   ... we could reserve, say, a 5-slot inline list of children...
* userProps:                  any old object; not interpreted by ArtEngine (DEPRICATE?)

## Element  Types

### Element
Ideally I'd like to include TextElement's capabilities AND BitmapElement's.

### BitmapElements

There are two main things BitmapElement does that goes beyond the current 'draw' prop's capabilities:

* async bitmap loading and caching with events
* fit/zoom/focus layout with clipping

### TextElement
Has a bunch of extra props. Do we really want every element to have all of these?

- Many are animatable...
- NEW: we want Span capabilities...
- Span props should be animatable... (color...)
- Spans should probably be "children" elements.
- It might be nice if "text" was just a string child element - the simplest span.

### ScrollElement
  Would then be the only alt element type!

### TextInputElement

### FilterElements

### CustomElements

## ArtEngine Events

I'd like to make events naturally ArtReact-worker friendly so we almost never need preprocessors.
