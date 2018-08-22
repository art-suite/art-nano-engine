# Art.Nano.Engine Draw Langauge

### Data-Structure

* command-array (unsigned bytes)
* number-constants (float32s)
* string/other-constants (JS array)
  could be one big string with slicing...
  We'd have to encode the slice-length as a number-constant for every string read.
  With inline-with-commands-uint8-constants, that's ok.
  Better-yet, perhaps it's encoded in the string?
    I want to separate the "program" (commands) from the data (constants)
    for animation-blending purposes.
  Slice is very fast: https://jsperf.com/slice-vs-substr-vs-substring-methods-long-string/19

Command and number-constants could be one float32 array...

### Commands

Key: "!" means animated

#### Alter Pixels
* fill
* stroke
! drawBitmap
  hmm - the drawMatrix usually shouldn't be animated for cross-fading
  two different-sized bitmaps...

#### Line Props
! setLineWidth  pop1
* lineCap       1-enumerated-uint8-constant
* lineJoin      1-enumerated-uint8-constant

#### Other Props
* compositeMode 1-enumerated-uint8-constant

#### Reset
* reset         all: resetClip, resetDrawArea, resetShape, resetProps, resetMatrix
* resetClip     (clip off)
* resetArea     (location = 0, size = parentSize)
* resetShape    (shape = rectangle)
* resetProps    color=black, radial=false, shadow=false, lineWidth=1, lineJoin=default, lineCap=default
* resetMatrix

#### Clipping
* clip (to current Area)

#### Area
* setLocation   (pop 2)
* setSize       (pop 2)

#### Colors
! setColor      (string-constant)
! setColors               (uint8-constant:numColors, numColors-color-string-constants}
! setColorsWithPositions  (uint8-constant:numColors, numColors-color-string-constants, numColors-float-constants}
* repeatColors  (uint8-constant) (for stripes!)
! setTo         (pop2)
! setFrom       (pop2)
* setRadial     ()

#### shadow
! setShadow
  - 1-string-constant
  - pop3: x/y offset, blur

#### Numbers-stack
* push0           push 0
* pushHalf        push .5
* push1           push 1
* pushPoint0      push 0, 0
* pushPoint1      push 1, 1
* pushPointHalf   push .5, .5
* pushNumber      push1-float-constant
* pushPoint       push2-float-constants
* pushParentSizeX push1
* pushParentSizeY push1
* pushParentSize  pushPoint
* add             pop2, push1
* sub             pop2, push1
* mul             pop2, push1
* div             pop2, push1
* max             pop2, push1
* min             pop2, push1
* addPoint        pop4, push2
* subPoint        pop4, push2
* mulPoint        pop4, push2
* divPoint        pop4, push2
* maxPoint        pop4, push2
* minPoint        pop4, push2
* pushTop         push1
* pushLeft        push1
* pushRight       push1
* pushBottom      push1
* pushTopLeft     push2
* pushBottomRight push2
  - topRight, bottomLeft, and all the centers... ?

* pop             pop1 (and ignore)
* popPoint        pop2 (and ignore)
* resetStack      pop-all (and ignore)

#### Draw Matrix
! translate: pop2
! rotate:    pop1
! scale:     pop2
! skew:      pop2

#### Shapes
* circle
* rectangle
* text (text is the shape -- TextElement or Element if includes text-support)
! curvedRectangle (pop4)
* shape
  - beginPath
  - closePath
  ! moveTo            (pop2)
  ! lineTo            (pop2)
  ! quadraticCurveTo  (pop4)
  ! bezierCurveTo     (pop6)
  ! artTo             (pop5)
  ! arc               (pop5)
  ! arcCcw            (pop5)
  ! rect              (pop4)

#### Children
* child:              (string-constant)
* children

#### Bitmap
* pushBitmapSize
